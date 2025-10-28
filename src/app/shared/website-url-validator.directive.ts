import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appWebsiteUrlValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: WebsiteUrlValidatorDirective, multi: true }],
})
export class WebsiteUrlValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const websiteUrl = control.value;

    if (!websiteUrl) {
      return null; 
    }

    // const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

    if (!urlPattern.test(websiteUrl)) {
      return { 'websiteUrlError': true, 'message': 'Please enter a valid website URL.' };
    }

    return null;
  }
}
