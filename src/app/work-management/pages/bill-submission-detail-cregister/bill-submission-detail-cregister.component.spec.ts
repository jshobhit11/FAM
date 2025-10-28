import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillSubmissionDetailCregisterComponent } from './bill-submission-detail-cregister.component';

describe('BillSubmissionDetailCregisterComponent', () => {
  let component: BillSubmissionDetailCregisterComponent;
  let fixture: ComponentFixture<BillSubmissionDetailCregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillSubmissionDetailCregisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillSubmissionDetailCregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
