import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILoginResponse, IResource } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UserSessionService } from '../../services/user-session.service';
import { LoaderService } from 'src/app/services/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { VersionService } from '../../services/version.service';
import { UserIdleService } from 'angular-user-idle';
import { Subscription } from 'rxjs';
import { SmsLogService } from 'src/app/services/SmsLogService';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { readWorkspace } from 'node_modules_backup/@angular-devkit/core/src/workspace';


declare var navigator: any;
declare var device: any;

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
  // getUserDetailsByUsername: any;
  // mobileNo: any;
  // userCode: any;
  // officeId: any;
  // discom: any;

  constructor(
    private authService: AuthService,
    private userSession: UserSessionService,
    private router: Router,
    private loader: LoaderService,
    private cookieService: CookieService,
    private userIdle: UserIdleService,
    private route: ActivatedRoute,
    private versionService: VersionService,
    private smsLogService: SmsLogService,
    private snackbar: MatSnackBar
  ) { }


  // ngOnInit() {
  //   this.route.queryParams.subscribe((params) => {
  //     this.username = params['username'];
  //     if (this.username) {
  //       this.doLogin();
  //     }
  //   });
  // }

  ngOnInit() {

    document.addEventListener("deviceready", () => {
      this.checkAndroidVersion();
    });

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


  checkAndroidVersion() {
    const version = parseInt(device.version, 10);

    if (version < 12) {
      this.snackbar.open('This app supports only Android 12 or higher.', 'OK', {
        verticalPosition: cordova !== undefined ? 'top' : 'top',
      });
      navigator.app.exitApp();  // Close the app
    } else {
      console.log("✔ Android version supported:", version);

    }
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

    this.authService
      .loginKeyCloak()
      .then((resp) => {
        if (!resp.access_token) {
          throw new Error('Access token not received from Keycloak');
        }

        this.userSession.saveAuthToken(this.username.toUpperCase(), 'test');
        return this.authService.login();
      })
      .then((response) => {
        this.loader.hide();
        console.log('=+++Before Version Check');

        if (response.message === 'Unauthorized') {
          this.loginError = 'Username or Password is invalid';
          return;
        }

        if (!response.userResponseDTO) {
          this.loginError = 'Invalid login response';
          return;
        }

        console.log('==Before Version Check');

        // ✅ Extract login response and save in session
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
          mobileNo: userResponseDTO.mobileNo,
          resources: response.resource.map((res: any) => ({
            roleResourceMasterId: res.roleResourceMasterId,
            resourceName: res.resourceName,
            resourceDiscription: res.resourceDiscription,
            roleId: res.roleId,
          })) as IResource[],
        };

        console.log('===Before Version Check');
        this.userSession.saveFromUserLoginResponse(loginResponse);


        // this.username = loginResponse.userName;
        // this.mobileNo = loginResponse.mobileNo; // Assign from login response
        // this.userCode = loginResponse.userCode;
        // this.officeId = loginResponse.officeId;
        // this.discom = loginResponse.discom;

        // ✅ Version check before SMS flow
        const appCode = 1;
        const currentVersion = 17;
        console.log("Before version check")
        // const appName = "FAM";

        this.versionService.validateApp(appCode, currentVersion).subscribe({
          next: (res: any) => {
            if (res.status === 'success') {
              // console.log(res.message);
              console.log('✅ Version validated successfully');

              this.handleSmsFlow(userResponseDTO.userName, userResponseDTO.mobileNo);

              // } else if (res.status === "error") {
              //   // alert('Version validation failed');
              //   alert("App not found");
              //   console.log(res.message);
            } else {

              alert('Please update your application to the latest version.');
              this.snackbar.open('Please Install the Latest APK', 'OK', {
                verticalPosition: cordova !== undefined ? 'top' : 'top',
              });


            }
          },
          error: (err) => {
            // console.error('Version validation error', err);
            // alert('Failed to validate version');
            this.snackbar.open('Failed to validate version, Try again later', 'OK', {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            });

          },

        });
      })
      .catch((error) => {
        console.error('Login failed:', error);
        this.loader.hide();
        this.loginError = 'Login failed: ' + error.message;
      });
  }



  // private handleSmsFlow(userName: string, mobileNo: string) {
  //   this.username = userName;

  //   // this.username = "Shobhit"; // temporary for testing

  //   this.smsLogService.checkUser(this.username).subscribe({
  //     next: (res: any) => {
  //       console.log("CheckUser Response:", res);

  //       // 🟩 CASE 1: USER NOT EXISTS → CREATE → OTP
  //       if (res.status === "not_exists") {
  //         console.log("User not found → creating new record");

  //         const smsDto = {
  //           mobileNo: mobileNo,
  //           senderId: "BESCOM",
  //           templateKey: "OTP_VERIFICATION",
  //           placeholders: { var1: "1234", var2: "kyc" },
  //           discom: 'BESCOM',
  //           discomCode: 2,
  //           officeId: '0001',
  //           personName: this.username,
  //           appCode: 3,
  //           usercode: 'U01'
  //         };

  //         this.smsLogService.createUser(smsDto).subscribe({
  //           next: () => {
  //             console.log("✅ New user created → redirecting to OTP");
  //             this.router.navigate(["/otp"], {
  //               queryParams: { phoneNo: smsDto.mobileNo },
  //             });
  //           },
  //           error: (err) => {
  //             console.error("❌ Failed to create user in sms log", err);
  //             alert("Failed to create new user in sms log");
  //           },
  //         });


  //       }

  //       // 🟦 CASE 2: USER EXISTS
  //       else if (res.status === "exists") {
  //         // const userStatus = res.userStatus;
  //         // const mobileNo = res.mobileNo;
  //         console.log('User found in SMS log → checking status');



  //         this.smsLogService.checkUser(this.username).subscribe({
  //           next: (userRes: any) => {
  //             console.log('UserStatus Response:', userRes);

  //             // CASE 2A: Verified → go to main
  //             if (userRes.status === 1) {
  //               console.log("✅ User verified → redirecting to main");
  //               this.navigateToMain();

  //             }

  //             // CASE 2B: Not verified → resend OTP
  //             else {
  //               console.log("User not verified → resending OTP");
  //               this.smsLogService.getUserDetailsByUsername(this.username).subscribe({


  //                 const smsDto = {
  //                   mobileNo: '9319940204',
  //                   senderId: "BESCOM",
  //                   templateKey: "OTP_VERIFICATION",
  //                   placeholders: { var1: "1234", var2: "kyc" },
  //                   discom: 'BESCOM',
  //                   discomCode: 2,
  //                   officeId: '0001',
  //                   personName: this.username,
  //                   appCode: 3,
  //                   usercode: 'U01'
  //                 };

  //                 this.smsLogService.createUser(smsDto).subscribe({
  //                   next: () => {
  //                     // console.log("OTP re-sent → redirecting to OTP");
  //                     console.log('✅ New user created → redirecting to OTP');

  //                     this.router.navigate(["/otp"], {
  //                       queryParams: { phoneNo: smsDto.mobileNo },
  //                     });
  //                   },
  //                   error: (err) => {
  //                     // console.error("❌ Failed to resend OTP", err);
  //                     console.error('❌ Failed to create new user in SMS log', err);

  //                     alert('Failed to create new user in SMS log');

  //                   },
  //                 });
  //               }
  //             },
  //             error: (err) => {
  //               console.error('❌ Failed to check user status', err);
  //               alert('Failed to check user status');
  //             },


  //           }),
  //         }
  //       // 🟨 Unexpected
  //       else {
  //         console.warn('Unexpected response from checkUser:', res);
  //         alert('Unexpected response from SMS log API');

  //       }

  //     },

  //     error: (err) => {
  //       console.error('❌ Failed to check username in SMS log', err);
  //       alert('Failed to check username in SMS log');
  //     },
  //   });
  // }


  private handleSmsFlow(userName: string, mobileNo: string) {
    this.smsLogService.checkUser(userName).subscribe({
      next: (res: any) => {
        console.log("CheckUser Response:", res);

        // 🟩 CASE 1: USER NOT EXISTS → Create → Send OTP
        if (res.status === "not_exists") {
          this.sendOtpAndRedirect(userName, mobileNo);
          return;
        }

        // 🟦 CASE 2: USER EXISTS
        if (res.status === "exists") {
          if (res.userStatus === 1) {
            console.log("✅ User verified → redirecting to main");
            this.navigateToMain();
          } else {
            console.log("User exists but not verified → Sending OTP again");
            this.sendOtpAndRedirect(userName, mobileNo);
          }
        } else {
          alert("Unexpected response from SMS API");
        }
      },

      error: (err) => {
        console.error("❌ Failed to check username in SMS log", err);
        alert("Failed to check username in SMS log");
      }
    });
  }


  private sendOtpAndRedirect(userName: string, mobileNo: string) {
    const smsDto = {
      mobileNo: '9319940204',
      senderId: "BESCOM",
      templateKey: "OTP_VERIFICATION",
      placeholders: { var1: "1234", var2: "kyc" },
      discom: 'BESCOM',
      discomCode: 2,
      officeId: '0001',
      personName: userName,
      appCode: 3,
      usercode: 'U01'
    };

    this.smsLogService.createUser(smsDto).subscribe({
      next: () => {
        console.log("📨 OTP Sent → Redirecting to OTP page");
        this.router.navigate(["/otp"], {
          queryParams: { phoneNo: smsDto.mobileNo },
        });
      },
      error: (err) => {
        console.error("❌ Failed to send OTP", err);
        alert("Failed to send OTP");
      },
    });
  }

  // --------------------------------------------
  // Helper Methods
  // --------------------------------------------
  navigateToMain() {
    this.doRedirect();
    this.userIdle.startWatching();
  }

  doRedirect() {
    return Promise.resolve().then(() =>
      this.router.navigate(["/main"], { replaceUrl: true })
    );
  }

  showAndHidePassword() {
    this.hidePassword = !this.hidePassword;
  }

  resetError() {
    this.loginError = "";
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
