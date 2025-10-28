import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspensePopupComponent } from './suspense-popup.component';

describe('SuspensePopupComponent', () => {
  let component: SuspensePopupComponent;
  let fixture: ComponentFixture<SuspensePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuspensePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspensePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
