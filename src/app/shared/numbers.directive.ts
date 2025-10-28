import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNumbers]'
})
export class NumbersDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    let value = inputElement.value;
    value = value.replace(/[^0-9.]/g, ''); 

    const decimalCount = value.split('.').length - 1;
    if (decimalCount > 1) {
      value = value.replace(/\.+$/, '');
    }

    inputElement.value = value;
  }
}
