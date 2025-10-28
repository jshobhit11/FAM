import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMainEstimateFarComponent } from './service-main-estimate-far.component';

describe('ServiceMainEstimateFarComponent', () => {
  let component: ServiceMainEstimateFarComponent;
  let fixture: ComponentFixture<ServiceMainEstimateFarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceMainEstimateFarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceMainEstimateFarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
