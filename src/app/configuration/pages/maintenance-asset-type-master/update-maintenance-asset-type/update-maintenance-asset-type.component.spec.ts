import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMaintenanceAssetTypeComponent } from './update-maintenance-asset-type.component';

describe('UpdateMaintenanceAssetTypeComponent', () => {
  let component: UpdateMaintenanceAssetTypeComponent;
  let fixture: ComponentFixture<UpdateMaintenanceAssetTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMaintenanceAssetTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMaintenanceAssetTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
