import { Directive, ElementRef, HostListener } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appPercentageValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PercentageValidatorDirective, multi: true }],
})
export class PercentageValidatorDirective implements Validator {

  constructor(private el: ElementRef) {}

  validate(control: AbstractControl): ValidationErrors | null {
    const percentage = control.value;

    if (!percentage) {
      return null;
    }

    const percentagePattern = /^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)%?$/;

    if (!percentagePattern.test(percentage) || parseFloat(percentage) > 100) {
      return { 'percentageError': true, 'message': 'Please enter a valid percentage between 0 and 100.' };
    }

    return null;
  }

  @HostListener('input', ['$event']) onInput(event: any) {
    const value = this.el.nativeElement.value;
    if (value && !value.endsWith('%')) {
      this.el.nativeElement.value = value + '%';
    }
  }
}
