import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CscSiteInspectionComponent } from './csc-site-inspection.component';

describe('CscSiteInspectionComponent', () => {
  let component: CscSiteInspectionComponent;
  let fixture: ComponentFixture<CscSiteInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CscSiteInspectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CscSiteInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
