import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appFileSizeValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: FileSizeDirective, multi: true }]
})
export class FileSizeDirective implements Validator {
  @Input() appFileSizeValidator: number;

  validate(control: AbstractControl): ValidationErrors | null {
    const file = control.value as File;

    if (file) {
      const fileSize = file.size || 0;
      const fileSizeInMB = fileSize / (1024 * 1024);

      return fileSizeInMB > this.appFileSizeValidator ? { 'fileSize': true } : null;
    }

    return null;
  }
}
