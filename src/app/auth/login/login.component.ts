import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILoginResponse, IResource } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ApiError } from '../../services/types';
import { UserSessionService } from '../../services/user-session.service';
import { LoaderService } from 'src/app/services/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { VersionService } from '../../services/version.service';

import { UserIdleService } from 'angular-user-idle';
import { Subscription } from 'rxjs';
import { SmsLogService } from 'src/app/services/SmsLogService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy, OnInit {
  public username: string = '';
  public password: string = '';
  public hidePassword: boolean = true;
  public loginError: string = '';
  public Response: ILoginResponse | null = null;
  showSpinner: boolean = false;
  private idleSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private userSession: UserSessionService,
    private router: Router,
    private loader: LoaderService,
    private cookieService: CookieService,
    private userIdle: UserIdleService,
    private route: ActivatedRoute,
    private versionService: VersionService,
    private smsLogService: SmsLogService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.username = params['username'];
      if (this.username) {
        this.doLogin();
      }
    });
  }

  ngOnDestroy() {
    this.stopWatching();
    if (this.idleSubscription) {
      this.idleSubscription.unsubscribe();
    }
  }

  doRedirect() {
    return Promise.resolve().then(() => {
      return this.router.navigate(['/main'], { replaceUrl: true });
    });
  }

  doLogin() {
    this.resetError();
    this.loader.show('Logging in...');
    this.userSession.deleteSavedTokenData();

    if (!this.password) {
      this.loginError = 'Password is not set';
      this.loader.hide();
      return;
    }

    this.userSession.saveLoginData(this.username.toUpperCase(), this.password);

    // Step 1: Login using Keycloak
    this.authService.loginKeyCloak()
      .then((resp) => {
        if (!resp.access_token) {
          throw new Error('Access token not received from Keycloak');
        }

        this.userSession.saveAuthToken(this.username.toUpperCase(), 'test');

        // Step 2: Authenticate user in your backend
        return this.authService.login();
      })
      .then((response) => {
        this.loader.hide();

        if (response.message === 'Unauthorized') {
          this.loginError = 'Username or Password is invalid';
          return;
        }

        if (!response.userResponseDTO) {
          this.loginError = 'Invalid login response';
          return;
        }

        // ✅ Step 3: Save user session
        const userResponseDTO = response.userResponseDTO;
        const loginResponse: ILoginResponse = {
          name: userResponseDTO.name,
          userName: userResponseDTO.userName,
          userCode: userResponseDTO.userCode,
          role: userResponseDTO.role,
          serviceKey: userResponseDTO.serviceKey,
          apiKey: userResponseDTO.apiKey,
          officeId: userResponseDTO.officeId.toString(),
          discom: userResponseDTO.discom.toString(),
          resources: response.resource.map((res: any) => ({
            roleResourceMasterId: res.roleResourceMasterId,
            resourceName: res.resourceName,
            resourceDiscription: res.resourceDiscription,
            roleId: res.roleId,
          })) as IResource[],
        };
        this.userSession.saveFromUserLoginResponse(loginResponse);

        // ✅ Step 4: Version check
        const appCode = 2;
        const currentVersion = 100001;

        this.versionService.validateApp(appCode, currentVersion).subscribe({
          next: (res: any) => {
            if (res.status === 'success') {

              // ✅ Step 5: Check SMS log for username
              this.smsLogService.checkUsername(this.username).subscribe({
                next: (smsRes: any) => {
                  if (smsRes.status === 'exists') {
                    console.log('SMS log found, redirecting to main');
                    this.navigateToMain();
                  } else {
                    console.log('No SMS log found for user, creating one');

                    const smsRequestDto = {
                      mobileNo: '9319940204',
                      senderId: 'MESCOM',
                      templateKey: 'MATERIAL_RETURN',
                      placeholders: { var1: '1234', var2: 'kyc' },
                      // placeholders: { var2: 'kyc' },
                      discom: 'Mescom',
                      discomCode: 2,
                      officeId: 'O001',
                      personName: 'Aditya',
                      appCode: 1,
                      usercode: 'U01'
                    };
                    this.smsLogService.createUser(smsRequestDto).subscribe({
                      next: () => {
                        this.router.navigate(['/otp'], {
                          queryParams: { phoneNo: smsRequestDto.mobileNo }
                        });
                      },
                      error: () => alert('Failed to create new user in SMS log')
                    });
                  }
                },
                error: () => alert(' SMS log API not reachable')
              });

            } else {
              alert(res.body); // version mismatch message
            }
          },
          error: () => alert('Version API not reachable')
        });
      })
      .catch((err) => {
        this.loader.hide();
        this.loginError = err.error || err.message || 'Login failed';
      });
  }

  navigateToMain() {
    this.doRedirect();
    this.userIdle.startWatching();
  }


  //                 this.doRedirect();
  // this.userIdle.startWatching();
  // this.idleSubscription = this.userIdle.onTimerStart().subscribe((count) => {
  //   if (count === 1) {
  //     this.userSession.doUserLogout();
  //     this.stopWatching();
  //     this.router.navigate(['/login'], { replaceUrl: true });
  //   }
  // });
  //               } else {
  //   this.loginError = 'ERR_FAILED';
  // }
  //             })
  //             .catch ((e: ApiError) => {
  //   this.loader.hide();
  //   if (e.message.toLowerCase() === 'unauthorized') {
  //     this.loginError = 'Username or Password is invalid';
  //   } else {
  //     this.loginError = e.error || e.message;
  //   }
  // });
  //         }
  //       })
  //       .catch ((e: ApiError) => {
  //   this.loader.hide();
  //   if (e.message.toLowerCase() === 'unauthorized') {
  //     this.loginError = 'Username or Password is invalid';
  //   } else {
  //     this.loginError = e.error || e.message;
  //   }
  // });
  //   }



  showAndHidePassword() {
    this.hidePassword = !this.hidePassword;
  }

  resetError() {
    this.loginError = '';
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  stop() {
    this.userIdle.stopTimer();
  }

  restart() {
    this.userIdle.resetTimer();
  }
}
