import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAssetCategoryMasterComponent } from './update-asset-category-master.component';

describe('UpdateAssetCategoryMasterComponent', () => {
  let component: UpdateAssetCategoryMasterComponent;
  let fixture: ComponentFixture<UpdateAssetCategoryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateAssetCategoryMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAssetCategoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
