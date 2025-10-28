import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appVechileNumber]'
})
export class VechileNumberDirective {
  constructor(private el: ElementRef) {}

  @HostListener('focus', ['$event']) onFocus(event: any) {
  }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    let inputValue = this.el.nativeElement.value;
    const alphanumericValue = inputValue.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const formattedValue = this.formatKarnatakaVehicleNumber(alphanumericValue);
    if (inputValue !== formattedValue) {
      this.el.nativeElement.value = formattedValue;
      setTimeout(() => {
        this.el.nativeElement.dispatchEvent(new Event('input'));
      });
    }

    const maxLength = 10;
    if (formattedValue.length >= maxLength) {
      event.preventDefault();
    }
  }

  private formatKarnatakaVehicleNumber(value: string): string {
    const maxLength = 10;
    value = value.substring(0, maxLength);
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
      if (i === 2 || i === 4 || i === 6) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }

    return formattedValue;
  }
}
