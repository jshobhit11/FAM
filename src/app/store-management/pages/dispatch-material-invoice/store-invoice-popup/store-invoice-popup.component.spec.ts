import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreInvoicePopupComponent } from './store-invoice-popup.component';

describe('StoreInvoicePopupComponent', () => {
  let component: StoreInvoicePopupComponent;
  let fixture: ComponentFixture<StoreInvoicePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreInvoicePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreInvoicePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
