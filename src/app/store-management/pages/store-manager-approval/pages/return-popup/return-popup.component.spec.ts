import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnPopupComponent } from './return-popup.component';

describe('ReturnPopupComponent', () => {
  let component: ReturnPopupComponent;
  let fixture: ComponentFixture<ReturnPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
