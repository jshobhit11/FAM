import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-awaiting-payment',
  templateUrl: './awaiting-payment.component.html',
  styleUrls: ['./awaiting-payment.component.scss'],
})
export class AwaitingPaymentComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('awaiting payment');
  }
  navigate() {
    this.router.navigate([`/main/home/4/NSC`]);
  }
}
