import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreInvAdjPopupComponent } from './store-inv-adj-popup.component';

describe('StoreInvAdjPopupComponent', () => {
  let component: StoreInvAdjPopupComponent;
  let fixture: ComponentFixture<StoreInvAdjPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreInvAdjPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreInvAdjPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
