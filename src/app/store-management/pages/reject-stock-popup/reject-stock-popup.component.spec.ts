import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectStockPopupComponent } from './reject-stock-popup.component';

describe('RejectStockPopupComponent', () => {
  let component: RejectStockPopupComponent;
  let fixture: ComponentFixture<RejectStockPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectStockPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectStockPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
