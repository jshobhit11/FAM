import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreaPopupComponent } from './storea-popup.component';

describe('StoreaPopupComponent', () => {
  let component: StoreaPopupComponent;
  let fixture: ComponentFixture<StoreaPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreaPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
