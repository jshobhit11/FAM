import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appVendorDateRangeValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: VendorDateRangeValidatorDirective, multi: true }],
})
export class VendorDateRangeValidatorDirective implements Validator {
  @Input('vendorRegistrationDate') vendorRegistrationDate: string = '';
  @Input('vendorRegistrationValidUpto') vendorRegistrationValidUpto: string = '';

  validate(control: AbstractControl): { [key: string]: any } | null {
    const registrationDateControl = control.root.get(this.vendorRegistrationDate);
    const validUptoControl = control.root.get(this.vendorRegistrationValidUpto);

    if (!registrationDateControl || !validUptoControl) {
      return null;
    }

    const registrationDate = new Date(registrationDateControl.value);
    const validUptoDate = new Date(validUptoControl.value);

    if (validUptoDate < registrationDate) {
      return { 'vendorDateRangeError': true, 'message': 'Valid Upto date should be after or equal to Registration Date.' };
    }

    return null;
  }
}
