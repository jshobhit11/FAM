import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoretPopupComponent } from './storet-popup.component';

describe('StoretPopupComponent', () => {
  let component: StoretPopupComponent;
  let fixture: ComponentFixture<StoretPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoretPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoretPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
