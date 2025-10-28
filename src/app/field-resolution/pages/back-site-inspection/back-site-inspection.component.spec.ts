import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackSiteInspectionComponent } from './back-site-inspection.component';

describe('BackSiteInspectionComponent', () => {
  let component: BackSiteInspectionComponent;
  let fixture: ComponentFixture<BackSiteInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackSiteInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackSiteInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
