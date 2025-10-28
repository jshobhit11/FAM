import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveToMeterUploadComponent } from './move-to-meter-upload.component';

describe('MoveToMeterUploadComponent', () => {
  let component: MoveToMeterUploadComponent;
  let fixture: ComponentFixture<MoveToMeterUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveToMeterUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveToMeterUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
