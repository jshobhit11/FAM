import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwaitingPaymentComponent } from './awaiting-payment.component';

describe('AwaitingPaymentComponent', () => {
  let component: AwaitingPaymentComponent;
  let fixture: ComponentFixture<AwaitingPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AwaitingPaymentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwaitingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
