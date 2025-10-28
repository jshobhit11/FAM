import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizedPopupComponent } from './optimized-popup.component';

describe('OptimizedPopupComponent', () => {
  let component: OptimizedPopupComponent;
  let fixture: ComponentFixture<OptimizedPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptimizedPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
