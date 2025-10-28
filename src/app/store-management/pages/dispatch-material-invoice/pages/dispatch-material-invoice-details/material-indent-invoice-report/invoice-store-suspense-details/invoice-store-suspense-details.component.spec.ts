import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceStoreSuspenseDetailsComponent } from './invoice-store-suspense-details.component';

describe('InvoiceStoreSuspenseDetailsComponent', () => {
  let component: InvoiceStoreSuspenseDetailsComponent;
  let fixture: ComponentFixture<InvoiceStoreSuspenseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceStoreSuspenseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceStoreSuspenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
