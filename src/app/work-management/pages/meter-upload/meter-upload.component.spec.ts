import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterUploadComponent } from './meter-upload.component';

describe('MeterUploadComponent', () => {
  let component: MeterUploadComponent;
  let fixture: ComponentFixture<MeterUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
