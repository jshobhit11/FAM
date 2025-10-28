import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAccountMeterMappingComponent } from './single-account-meter-mapping.component';

describe('SingleAccountMeterMappingComponent', () => {
  let component: SingleAccountMeterMappingComponent;
  let fixture: ComponentFixture<SingleAccountMeterMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleAccountMeterMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleAccountMeterMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
