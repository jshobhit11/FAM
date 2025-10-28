import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreiPopupComponent } from './storei-popup.component';

describe('StoreiPopupComponent', () => {
  let component: StoreiPopupComponent;
  let fixture: ComponentFixture<StoreiPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreiPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreiPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
