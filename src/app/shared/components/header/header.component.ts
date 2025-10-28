import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ApiError } from '../../../services/types';
import { UserSessionService } from '../../../services/user-session.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  username: string = '';

  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private authService: AuthService,
    private userSession: UserSessionService,
    private cookie: CookieService,
  ) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('user-name');
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  doLogout(ev: Event | null) {
    if (ev) {
      ev.preventDefault();
    }

    this.authService
      .logout()
      .then(() => {
        this.userSession.doUserLogout();
        this.router.navigate([''], { replaceUrl: true });
      })
      .catch((e: ApiError) => {
        if (!e.isHandledGlobally) {
          throw e;
        }
      });
  }

  Logout() {
    this.authService.signOut();
    sessionStorage.removeItem('username');
  }
}
