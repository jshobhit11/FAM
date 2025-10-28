import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetBomReportComponent } from './asset-bom-report.component';

describe('AssetBomReportComponent', () => {
  let component: AssetBomReportComponent;
  let fixture: ComponentFixture<AssetBomReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetBomReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetBomReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
