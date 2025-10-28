import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentInvoicePopupComponent } from './indent-invoice-popup.component';

describe('IndentInvoicePopupComponent', () => {
  let component: IndentInvoicePopupComponent;
  let fixture: ComponentFixture<IndentInvoicePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentInvoicePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndentInvoicePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
