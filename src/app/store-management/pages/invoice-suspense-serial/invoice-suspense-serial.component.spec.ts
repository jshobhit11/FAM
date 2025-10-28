import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSuspenseSerialComponent } from './invoice-suspense-serial.component';

describe('InvoiceSuspenseSerialComponent', () => {
  let component: InvoiceSuspenseSerialComponent;
  let fixture: ComponentFixture<InvoiceSuspenseSerialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceSuspenseSerialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSuspenseSerialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
