import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetCategoryMaterialMappingComponent } from './add-asset-category-material-mapping.component';

describe('AddAssetCategoryMaterialMappingComponent', () => {
  let component: AddAssetCategoryMaterialMappingComponent;
  let fixture: ComponentFixture<AddAssetCategoryMaterialMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAssetCategoryMaterialMappingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetCategoryMaterialMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
