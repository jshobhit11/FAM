import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appDate]'
})
export class DateDirective {
  @Input() dateFormat: string = 'yyyy-MM-dd';

  @HostListener('focus', ['$event.target']) onFocus(target: HTMLInputElement): void {
    const formattedDate = this.getFormattedCurrentDate();
    target.value = formattedDate;
  }

  constructor() {}

  private getFormattedCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = this.dateFormat
      .replace('yyyy', year.toString())
      .replace('MM', month)
      .replace('dd', day);

    return formattedDate;
  }


}
