import { Injectable } from '@angular/core';
import { UserSessionService } from './user-session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  constructor(private userSessionService: UserSessionService) {}

  public getAllowedResources(): string[] {
    const resources = this.userSessionService.getAllowedResources();
    if (resources.includes('ALL')) {
      return ['ALL'];
    }
    return resources;
  }

  public getUserRole(): string {
    return this.userSessionService.getUserRole();
  }
  public getUserName(): string {
    return this.userSessionService.getUserName();
  }
}
