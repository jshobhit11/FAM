import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appPortingDates]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PortingDatesDirective, multi: true }],
})
export class PortingDatesDirective implements Validator{
  @Input('portingStartDateControlName') portingStartDateControlName: string = '';

  validate(control: AbstractControl): { [key: string]: any } | null {
    const portingStartDateControl = control.root.get(this.portingStartDateControlName);
  
    if (!portingStartDateControl) {
      return null;
    }
  
    const portingStartDate = new Date(portingStartDateControl.value);
    const portingEndDate = new Date(control.value);
  
    if (portingEndDate <= portingStartDate) {
      return { 'dateRangeError': true };
    }

    return null;
  }
}
