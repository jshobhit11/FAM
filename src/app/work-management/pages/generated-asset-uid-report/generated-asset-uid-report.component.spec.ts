import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedAssetUidReportComponent } from './generated-asset-uid-report.component';

describe('GeneratedAssetUidReportComponent', () => {
  let component: GeneratedAssetUidReportComponent;
  let fixture: ComponentFixture<GeneratedAssetUidReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneratedAssetUidReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratedAssetUidReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
