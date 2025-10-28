import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFeasibilityPointPopupComponent } from './view-feasibility-point-popup.component';

describe('ViewFeasibilityPointPopupComponent', () => {
  let component: ViewFeasibilityPointPopupComponent;
  let fixture: ComponentFixture<ViewFeasibilityPointPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFeasibilityPointPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFeasibilityPointPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
