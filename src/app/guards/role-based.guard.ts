import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../services/authorization.service'; 

@Injectable({
  providedIn: 'root',
})
export class RoleBasedGuard implements CanActivate {
  constructor(
    private authorizationService: AuthorizationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requestedResource = this.getResourceFromUrl(route.url);
    const userRole = this.authorizationService.getUserRole();
    if (requestedResource.startsWith('configuration')) {
      if (userRole === 'ROLE_ADMIN') {
        return true;
      } else {
        this.router.navigate(['main/unauthorized']);
        return false;
      }
    }
    const allowedResources = this.authorizationService.getAllowedResources();
    if (allowedResources.includes('ALL') || allowedResources.includes(requestedResource)) {
      return true;
    } else {
      this.router.navigate(['main/unauthorized']);
      return false;
    }
  }

  private getResourceFromUrl(urlSegments: any[]): string {
    return urlSegments.map(segment => segment.path).join('/');
  }
}
