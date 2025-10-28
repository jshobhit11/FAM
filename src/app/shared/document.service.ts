import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private serviceRegistrationId: number;
  private previousUrl: string;
  constructor(private router: Router) { }

  setServiceRegistrationId(id: number) {
    this.serviceRegistrationId = id;
  }

  getServiceRegistrationId() {
    return this.serviceRegistrationId;
  }
  setPreviousUrl(url: string) {
    this.previousUrl = url;
  }
  
  navigateBack() {
    if (this.previousUrl) {
      this.router.navigateByUrl(this.previousUrl);
    } else {
      this.router.navigate(['/']);
    }
  }
  
  navigateToViewDocument(routePath: string) {
    this.router.navigate([routePath]);
  }
}
