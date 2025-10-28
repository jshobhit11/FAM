import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
const cRegisteredForm = new FormGroup({
  workOrderNo: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-c-registered-detail',
  templateUrl: './c-registered-detail.component.html',
  styleUrls: ['./c-registered-detail.component.scss'],
})
export class CRegisteredDetailComponent implements OnInit {
  cRegisteredForm: FormGroup = cRegisteredForm;
  workOrder: any;
  submitError: boolean = false;
  error: string;
  constructor(
    private router: Router,
    private snakbacr: MatSnackBar,
    private formBuilder: FormBuilder
    ) {}
  ngOnInit() {
    this.resetForm();
  }
  resetForm() {
    this.cRegisteredForm = new FormGroup({
      workOrderNo: new FormControl('', [Validators.required]),
    });
  }
  async onSubmit() {
    this.cRegisteredForm.markAllAsTouched();
    if (this.isValidForm()) {
    this.router.navigate([
      `/work-management/c-register-full-details/${this.cRegisteredForm.get('workOrderNo').value}`,
    ]);
  }
}
isValidForm(): boolean {
  this.cRegisteredForm.markAllAsTouched();
  console.log('Form Valid?', this.cRegisteredForm.valid);
  let hasError = false;
  Object.keys(this.cRegisteredForm.controls).forEach((key) => {
    const control = this.cRegisteredForm.get(key);

    if (control && (control.invalid || control.untouched)) {
      hasError = true;
    }
  });

  if (hasError) {
    this.error = 'Please Fill Out Mandatory Fields';
    return false;
  } else {
    this.error = '';
    return true;
  }
}
}
