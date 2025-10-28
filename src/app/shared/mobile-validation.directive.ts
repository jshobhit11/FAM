import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMobileValidation]'
})
export class MobileValidationDirective {
  constructor(private el: ElementRef) {}

  @HostListener('focus', ['$event']) onFocus(event: any) {
  }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    let inputValue = this.el.nativeElement.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    const maxLength = 10;
    const formattedValue = numericValue.substring(0, maxLength);
    if (formattedValue !== inputValue) {

      this.el.nativeElement.value = formattedValue;
      this.el.nativeElement.dispatchEvent(new Event('input'));
    }
  }
}
