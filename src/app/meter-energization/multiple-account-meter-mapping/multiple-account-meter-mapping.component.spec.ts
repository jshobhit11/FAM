import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleAccountMeterMappingComponent } from './multiple-account-meter-mapping.component';

describe('MultipleAccountMeterMappingComponent', () => {
  let component: MultipleAccountMeterMappingComponent;
  let fixture: ComponentFixture<MultipleAccountMeterMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleAccountMeterMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleAccountMeterMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
