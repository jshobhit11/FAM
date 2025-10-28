import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetCategoryMasterComponent } from './add-asset-category-master.component';

describe('AddAssetCategoryMasterComponent', () => {
  let component: AddAssetCategoryMasterComponent;
  let fixture: ComponentFixture<AddAssetCategoryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAssetCategoryMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetCategoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
