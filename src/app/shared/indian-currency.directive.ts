import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appIndianCurrency]'
})
export class IndianCurrencyDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;

    // Remove non-numeric characters except the dot
    let value = inputElement.value.replace(/[^0-9.]/g, '');

    // Ensure there's only one dot
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    // Format as numeric value with decimal
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2); // Limit to two decimal places
      value = parts.join('.');
    }

    inputElement.value = value;
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.charCode);

    // Allow only numeric values, backspace, and one dot
    if (!/^\d$/.test(inputChar) && event.key !== '.' && event.key !== 'Backspace') {
      event.preventDefault();
    }

    // Ensure only one dot is allowed
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const currentValue = inputElement.value;
    if (event.key === '.' && currentValue.includes('.')) {
      event.preventDefault();
    }
  }
}
