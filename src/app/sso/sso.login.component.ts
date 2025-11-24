import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { StorageService } from '../_services/storage.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { UserSessionService } from '../services/user-session.service';

@Component({
  selector: 'app-sso-login',
  template: ''
})
export class SSOLoginComponent implements OnInit {

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private storage: UserSessionService) {
    this.activatedRoute.queryParams.subscribe((params) => {
      const auth = params['auth'];
      if (auth) {
        this.storage.setItem('user', auth);
        params['returnUrl'] ? this.router.navigate([params['returnUrl']]) : this.router.navigate(['/home']);
        return;
      }

      else {
        this._authService.ssoLogin();
      };
    });
  }

  ngOnInit(): void {
  }

}
