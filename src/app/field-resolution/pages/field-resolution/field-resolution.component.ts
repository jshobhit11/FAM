import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-field-resolution',
  templateUrl: './field-resolution.component.html',
  styleUrls: ['./field-resolution.component.scss']
})
export class FieldResolutionComponent implements OnInit {
  sideBarOpen = true;
  showComplaintsResolution = true;
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showComplaintsResolution = this.router.url === '/field-resolution';
      }
    });
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

}
