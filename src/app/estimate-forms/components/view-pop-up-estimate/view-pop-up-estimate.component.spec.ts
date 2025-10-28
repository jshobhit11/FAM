import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPopUpEstimateComponent } from './view-pop-up-estimate.component';

describe('ViewPopUpEstimateComponent', () => {
  let component: ViewPopUpEstimateComponent;
  let fixture: ComponentFixture<ViewPopUpEstimateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPopUpEstimateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPopUpEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
