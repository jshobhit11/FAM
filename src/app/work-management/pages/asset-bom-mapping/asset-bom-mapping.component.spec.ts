import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetBomMappingComponent } from './asset-bom-mapping.component';

describe('AssetBomMappingComponent', () => {
  let component: AssetBomMappingComponent;
  let fixture: ComponentFixture<AssetBomMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetBomMappingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetBomMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
