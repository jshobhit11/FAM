import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInventoryAbstractReportComponent } from './stock-inventory-abstract-report.component';

describe('StockInventoryAbstractReportComponent', () => {
  let component: StockInventoryAbstractReportComponent;
  let fixture: ComponentFixture<StockInventoryAbstractReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockInventoryAbstractReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInventoryAbstractReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
