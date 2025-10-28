import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAlphaNumeric]',
})
export class AlphaNumericDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    // Allow letters, numbers, underscores, hyphens, commas, dots, and spaces
    let value = inputElement.value.replace(/[^a-zA-Z0-9_. , -]/g, '');

    if (inputElement.value !== value) {
      inputElement.value = value;
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    // Allow letters, numbers, underscores, hyphens, commas, dots, and spaces
    if (/[^a-zA-Z0-9_. , -]/.test(event.key)) {
      event.preventDefault();
    }
  }
}
