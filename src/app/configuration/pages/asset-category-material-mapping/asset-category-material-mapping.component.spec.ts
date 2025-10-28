import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetCategoryMaterialMappingComponent } from './asset-category-material-mapping.component';

describe('AssetCategoryMaterialMappingComponent', () => {
  let component: AssetCategoryMaterialMappingComponent;
  let fixture: ComponentFixture<AssetCategoryMaterialMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetCategoryMaterialMappingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCategoryMaterialMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
