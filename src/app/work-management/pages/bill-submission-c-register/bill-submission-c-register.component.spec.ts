import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillSubmissionCRegisterComponent } from './bill-submission-c-register.component';

describe('BillSubmissionCRegisterComponent', () => {
  let component: BillSubmissionCRegisterComponent;
  let fixture: ComponentFixture<BillSubmissionCRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillSubmissionCRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillSubmissionCRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
