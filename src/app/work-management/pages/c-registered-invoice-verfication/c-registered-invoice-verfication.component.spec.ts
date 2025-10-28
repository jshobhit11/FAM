import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRegisteredInvoiceVerficationComponent } from './c-registered-invoice-verfication.component';

describe('CRegisteredInvoiceVerficationComponent', () => {
  let component: CRegisteredInvoiceVerficationComponent;
  let fixture: ComponentFixture<CRegisteredInvoiceVerficationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CRegisteredInvoiceVerficationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CRegisteredInvoiceVerficationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
