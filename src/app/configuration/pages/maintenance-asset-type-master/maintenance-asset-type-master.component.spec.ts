import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceAssetTypeMasterComponent } from './maintenance-asset-type-master.component';

describe('MaintenanceAssetTypeMasterComponent', () => {
  let component: MaintenanceAssetTypeMasterComponent;
  let fixture: ComponentFixture<MaintenanceAssetTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceAssetTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceAssetTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
