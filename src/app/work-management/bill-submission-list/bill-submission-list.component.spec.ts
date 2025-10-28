import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillSubmissionListComponent } from './bill-submission-list.component';

describe('BillSubmissionListComponent', () => {
  let component: BillSubmissionListComponent;
  let fixture: ComponentFixture<BillSubmissionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillSubmissionListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillSubmissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
