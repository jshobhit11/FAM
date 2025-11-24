import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Subject } from 'rxjs';
import { ILoginResponse } from '../models/user.model';
import { A } from 'node_modules_backup/@angular/cdk/keycodes';
import appShell from 'node_modules_backup/@schematics/angular/app-shell';
import { ApiEndpoint } from './api-endpoint';

const SessionNoExpireValue = '-1';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  authTokenExpirationSubject = new Subject();
  private loginResponse: ILoginResponse | null = null;
  private allowedResources: string[] = [];
  private userRole: string = '';
  private userName: string = '';

  constructor() {
    this.loadUserData();
  }

  private loadUserData(): void {
    const storedResources = sessionStorage.getItem('allowed-resources');
    if (storedResources) {
      this.allowedResources = JSON.parse(storedResources);
    }
    const storedUserRole = sessionStorage.getItem('user-role');
    if (storedUserRole) {
      this.userRole = storedUserRole;
    }
    const storedUserName = sessionStorage.getItem('user-name');
    if (storedUserName) {
      this.userName = storedUserName
    }
  }

  public doUserLogout() {
    this.deleteSavedTokenData();
  }

  public saveFromUserLoginResponse(response: ILoginResponse): void {
    sessionStorage.setItem('name', response.name);
    sessionStorage.setItem('user-name', response.userName);
    sessionStorage.setItem('user-code', response.userCode);
    sessionStorage.setItem('user-role', response.role);
    sessionStorage.setItem('api-key', response.apiKey);
    sessionStorage.setItem('service-key', response.serviceKey);
    sessionStorage.setItem('office-id', response.officeId);
    sessionStorage.setItem('discom', response.discom);
    this.allowedResources = response.resources.map(resource => resource.resourceName);
    if (response.role === 'ROLE_ADMIN') {
      this.allowedResources = ['ALL'];
    }
    sessionStorage.setItem('allowed-resources', JSON.stringify(this.allowedResources));
    this.userRole = response.role;
    this.userName = response.userName;
  }


  getAuthDetails() {
    return {
      username: sessionStorage.getItem('user-name'),
      password: sessionStorage.getItem('key-cloak-password'),
      apikey: sessionStorage.getItem('api-key'),
      servicekey: sessionStorage.getItem('service-key'),
      officeid: sessionStorage.getItem('office-id'),
      discom: sessionStorage.getItem('discom'),
      usercode: sessionStorage.getItem('user-code'),
      userrole: sessionStorage.getItem('user-role'),




    }
  }

  public saveAuthToken(username: string, password: string): void {
    sessionStorage.setItem('auth-token', btoa(`${username}:${password}`));
  }

  public saveLoginData(username: string, password: string): void {
    sessionStorage.setItem('key-cloak-user', `${username}`);
    sessionStorage.setItem('key-cloak-password', `${password}`);
  }

  public getAllowedResources(): string[] {
    return this.allowedResources;
  }

  public hasSavedValidToken(): boolean {
    const userName = sessionStorage.getItem('user-name');
    if (userName === null) {
      this.deleteSavedTokenData();
      return false;
    }
    return true;
  }

  public deleteSavedTokenData(): void {
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('user-name');
    sessionStorage.removeItem('user-code');
    sessionStorage.removeItem('user-role');
    sessionStorage.removeItem('api-key');
    sessionStorage.removeItem('office-id');
    sessionStorage.removeItem('service-key');
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('allowed-resources');
  }

  public getRequestToken(): Promise<string | null> {
    const now = DateTime.local();
    const savedToken = sessionStorage.getItem('session-token');
    if (savedToken === null) {
      return Promise.resolve(null);
    }
    const tokenExpires = sessionStorage.getItem('session-token-expires') as string;
    return Promise.resolve()
      .then(() => {
        if (tokenExpires !== SessionNoExpireValue && DateTime.fromISO(tokenExpires) <= now) {
          throw new TokenExpiredError('TOKEN_EXPIRED');
        }
      })
      .catch((err) => {
        if (err === 'TOKEN_EXPIRED') {
          window.location.reload();
        }
      })
      .then(() => {
        return savedToken;
      });
  }

  public getUserRole(): string {
    return this.userRole;
  }
  public getUserName(): string {
    return this.userName;
  }
  private store = new Map<string, string>();

  public setItem(key: any, value: any) {
    this.store.set(key, value);
  }
}

class TokenExpiredError extends Error { }
