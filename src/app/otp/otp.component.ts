import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OtpService } from '../services/otp.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
  phoneNo: string = '';
  otp: string = '';
  isSubmitting: boolean = false;
  successMsg: string = '';
  errorMsg: string = '';

  constructor(
    private route: ActivatedRoute,
    private otpService: OtpService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // ✅ Get phone number from query parameters (from login redirect)
    this.route.queryParams.subscribe(params => {
      this.phoneNo = params['phoneNo'] || '';
    });
  }

  validateOtp(): void {
    if (!this.otp) {
      this.errorMsg = 'Please enter the OTP.';
      return;
    }

    this.isSubmitting = true;
    this.successMsg = '';
    this.errorMsg = '';

    // ✅ Call backend validation API
    this.otpService.validateOtp(this.phoneNo, this.otp).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;

        if (res.status === 'success' || res.message === 'OTP Verified successfully') {
          this.successMsg = '✅ OTP verified successfully!';
          setTimeout(() => this.router.navigate(['/main']), 1000);
        } else {
          this.errorMsg = res.message || 'Invalid OTP. Please try again.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMsg = err.error?.message || 'Server not reachable or OTP invalid.';
      }
    });
  }
}
