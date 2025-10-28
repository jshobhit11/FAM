import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackAccountMeterMappingComponent } from './back-account-meter-mapping.component';

describe('BackAccountMeterMappingComponent', () => {
  let component: BackAccountMeterMappingComponent;
  let fixture: ComponentFixture<BackAccountMeterMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackAccountMeterMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackAccountMeterMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
