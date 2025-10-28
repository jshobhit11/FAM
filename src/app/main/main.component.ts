import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  sideBarOpen = false;

  constructor() {}

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
