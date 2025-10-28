import { Component, Input } from '@angular/core';

@Component({
  selector: 'date-pipe-third',
  template: `
    {{date | date:'yyyy-MM-dd hh:mm:ss a'}}
  `
 })
 // Get the current date and time as a date-time value.
 export class DatePipeThirdComponent {
    @Input() date: string = '';
 }