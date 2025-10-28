import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectReturnPopupComponent } from './reject-return-popup.component';

describe('RejectReturnPopupComponent', () => {
  let component: RejectReturnPopupComponent;
  let fixture: ComponentFixture<RejectReturnPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectReturnPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectReturnPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
