import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appValidation]'
})
export class ValidationDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;
    const pattern = /^[a-zA-Z\s]*$/;

    if (!pattern.test(initialValue)) {
      this.el.nativeElement.value = initialValue.replace(/[^a-zA-Z\s]/g, '');
      event.preventDefault();
    }
}
}