import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
@Directive({
  selector: '[appDateTo]',
  providers: [{ provide: NG_VALIDATORS, useExisting: DateToDirective, multi: true }],
})
export class DateToDirective implements Validator{
  @Input('fromDateControlName') fromDateControlName: string = '';


  validate(control: AbstractControl): { [key: string]: any } | null {
    const fromDateControl = control.root.get(this.fromDateControlName);

    if (!fromDateControl) {
      return null;
    }

    const startDate = new Date(fromDateControl.value);
    const endDate = new Date(control.value);

    if (startDate >= endDate) {
      return { 'dateRangeError': true };
    }

    return null;
  }
}
