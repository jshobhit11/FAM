import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSerialNumberComponent } from './stock-serial-number.component';

describe('StockSerialNumberComponent', () => {
  let component: StockSerialNumberComponent;
  let fixture: ComponentFixture<StockSerialNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockSerialNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSerialNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
