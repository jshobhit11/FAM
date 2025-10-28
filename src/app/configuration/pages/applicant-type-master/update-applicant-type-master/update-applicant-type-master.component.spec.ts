import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateApplicantTypeMasterComponent } from './update-applicant-type-master.component';

describe('UpdateApplicantTypeMasterComponent', () => {
  let component: UpdateApplicantTypeMasterComponent;
  let fixture: ComponentFixture<UpdateApplicantTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateApplicantTypeMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateApplicantTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
