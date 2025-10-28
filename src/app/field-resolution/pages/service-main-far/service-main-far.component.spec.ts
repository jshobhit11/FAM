import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMainFarComponent } from './service-main-far.component';

describe('ServiceMainFarComponent', () => {
  let component: ServiceMainFarComponent;
  let fixture: ComponentFixture<ServiceMainFarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceMainFarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceMainFarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
