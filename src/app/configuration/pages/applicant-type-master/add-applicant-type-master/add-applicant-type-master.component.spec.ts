import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApplicantTypeMasterComponent } from './add-applicant-type-master.component';

describe('AddApplicantTypeMasterComponent', () => {
  let component: AddApplicantTypeMasterComponent;
  let fixture: ComponentFixture<AddApplicantTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddApplicantTypeMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApplicantTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
