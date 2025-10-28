import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupGisFeasibilityComponent } from './popup-gis-feasibility.component';

describe('PopupGisFeasibilityComponent', () => {
  let component: PopupGisFeasibilityComponent;
  let fixture: ComponentFixture<PopupGisFeasibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupGisFeasibilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupGisFeasibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
