import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPointPopupComponent } from './view-point-popup.component';

describe('ViewPointPopupComponent', () => {
  let component: ViewPointPopupComponent;
  let fixture: ComponentFixture<ViewPointPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPointPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPointPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
