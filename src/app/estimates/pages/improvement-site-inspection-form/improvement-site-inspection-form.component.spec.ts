import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementSiteInspectionFormComponent } from './improvement-site-inspection-form.component';

describe('ImprovementSiteInspectionFormComponent', () => {
  let component: ImprovementSiteInspectionFormComponent;
  let fixture: ComponentFixture<ImprovementSiteInspectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImprovementSiteInspectionFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementSiteInspectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
