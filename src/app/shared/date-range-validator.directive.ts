import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appDateRangeValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: DateRangeValidatorDirective, multi: true }],
})
export class DateRangeValidatorDirective implements Validator {
  @Input('fromDateControlName') fromDateControlName: string = '';


  validate(control: AbstractControl): { [key: string]: any } | null {
    const fromDateControl = control.root.get(this.fromDateControlName);

    if (!fromDateControl) {
      return null;
    }

    const fromDate = new Date(fromDateControl.value);
    const toDate = new Date(control.value);

    if (toDate <= fromDate) {
      return { 'dateRangeError': true };
    }

    return null;
  }
}
