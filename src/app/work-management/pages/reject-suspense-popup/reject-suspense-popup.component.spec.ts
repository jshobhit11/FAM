import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectSuspensePopupComponent } from './reject-suspense-popup.component';

describe('RejectSuspensePopupComponent', () => {
  let component: RejectSuspensePopupComponent;
  let fixture: ComponentFixture<RejectSuspensePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectSuspensePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectSuspensePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
