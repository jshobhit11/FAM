import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspenseInvoicePopupComponent } from './suspense-invoice-popup.component';

describe('SuspenseInvoicePopupComponent', () => {
  let component: SuspenseInvoicePopupComponent;
  let fixture: ComponentFixture<SuspenseInvoicePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuspenseInvoicePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspenseInvoicePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
