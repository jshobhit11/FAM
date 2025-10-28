import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
// import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-sso-login',
  template: ''
})
export class SSOLogoutComponent implements OnInit {

  constructor(
    private _authService: AuthService) {
   }

  ngOnInit(): void {    
    this._authService.signOut();
  }

}
