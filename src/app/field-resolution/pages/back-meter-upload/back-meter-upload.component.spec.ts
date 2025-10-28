import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackMeterUploadComponent } from './back-meter-upload.component';

describe('BackMeterUploadComponent', () => {
  let component: BackMeterUploadComponent;
  let fixture: ComponentFixture<BackMeterUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackMeterUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackMeterUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
