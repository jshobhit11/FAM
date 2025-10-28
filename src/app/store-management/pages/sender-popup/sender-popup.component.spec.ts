import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenderPopupComponent } from './sender-popup.component';

describe('SenderPopupComponent', () => {
  let component: SenderPopupComponent;
  let fixture: ComponentFixture<SenderPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenderPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SenderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
