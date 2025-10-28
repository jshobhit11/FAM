import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantTypeMasterComponent } from './applicant-type-master.component';

describe('ApplicantTypeMasterComponent', () => {
  let component: ApplicantTypeMasterComponent;
  let fixture: ComponentFixture<ApplicantTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicantTypeMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
