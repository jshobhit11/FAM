import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appLineDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: LineDateDirective, multi: true }],
})
export class LineDateDirective {
  @Input('fromDateControlName') fromDateControlName: string = '';


  validate(control: AbstractControl): { [key: string]: any } | null {
    const fromDateControl = control.root.get(this.fromDateControlName);

    if (!fromDateControl) {
      return null;
    }

    const shutdownStartDate = new Date(fromDateControl.value);
    const shutdownEndDate = new Date(control.value);

    if (shutdownStartDate >= shutdownEndDate) {
      return { 'dateRangeError': true };
    }

    return null;
  }
}
