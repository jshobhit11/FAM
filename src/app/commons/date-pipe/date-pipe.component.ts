import { Component, Input } from '@angular/core';

@Component({
  selector: 'date-pipe',
  template: `
    {{date | date:'yyyy-MM-dd hh:mm:ss a'}}
  `
 })
 export class DatePipeComponent {
    @Input() date: string = '';
 }