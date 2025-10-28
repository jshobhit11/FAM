import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreInventoryAdjustmentComponent } from './StoreInventoryAdjustmentComponent';

describe('StoreInventoryAdjustmentComponent', () => {
  let component: StoreInventoryAdjustmentComponent;
  let fixture: ComponentFixture<StoreInventoryAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreInventoryAdjustmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreInventoryAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
