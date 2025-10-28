import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-update-rc-rate',
  templateUrl: './update-rc-rate.component.html',
  styleUrls: ['./update-rc-rate.component.scss'],
})
export class UpdateRcRateComponent {
  constructor(private router: Router, private Service: CommonService) {}

  toRcRates() {
    this.router.navigate(['configuration/rc-rate-master']);
  }
}
