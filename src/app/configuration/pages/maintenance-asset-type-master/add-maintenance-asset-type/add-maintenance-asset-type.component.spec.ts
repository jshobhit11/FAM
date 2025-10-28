import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaintenanceAssetTypeComponent } from './add-maintenance-asset-type.component';

describe('AddMaintenanceAssetTypeComponent', () => {
  let component: AddMaintenanceAssetTypeComponent;
  let fixture: ComponentFixture<AddMaintenanceAssetTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaintenanceAssetTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaintenanceAssetTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
