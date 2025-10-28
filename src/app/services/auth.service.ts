import { Injectable } from '@angular/core';
import { ApiEndpoint } from './api-endpoint';
import { RestAPIService } from './rest-api.service';
import { APIUrl, RequestMethod } from './types';
import { environment } from 'src/environments/environment';
import { ApiEndpointForKeyCloak } from './api-endpoint-for-keycloak';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends RestAPIService {
  private authApiUrl = environment.authApiUrl;

  login() {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.Login);
    return this.sendRequest<any>(endpoint);
  }

  loginKeyCloak() {
    //Production
   // const endpoint = new ApiEndpointForKeyCloak(RequestMethod.Post, APIUrl.MobileLoginThroughKeycloak);
    //Testing
    const endpoint = new ApiEndpointForKeyCloak(RequestMethod.Post, APIUrl.MobileLoginThroughKeycloakTest);
    return this.sendRequestForKeyCloak<any>(endpoint);
  }

  logout(): Promise<void> {
    return Promise.resolve();
  }
  ssoLogin() {
    window.open(`${this.authApiUrl}/login`,"_self");
 
  }
  private store = new Map<string, string>();

  clearStorage() {
    return this.store.clear();
  }

  signOut() {
    this.clearStorage();
    // this.ssoLogOut();
    this.logout();
  }
  ssoLogOut() {
    return window.open(`${this.authApiUrl}/logout?`, "_self");
  }
}
