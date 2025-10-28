import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAssetCategoryMaterialMappingComponent } from './update-asset-category-material-mapping.component';

describe('UpdateAssetCategoryMaterialMappingComponent', () => {
  let component: UpdateAssetCategoryMaterialMappingComponent;
  let fixture: ComponentFixture<UpdateAssetCategoryMaterialMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateAssetCategoryMaterialMappingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      UpdateAssetCategoryMaterialMappingComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
