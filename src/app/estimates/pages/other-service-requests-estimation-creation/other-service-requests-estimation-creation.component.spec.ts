import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherServiceRequestsEstimationCreationComponent } from './other-service-requests-estimation-creation.component';

describe('OtherServiceRequestsEstimationCreationComponent', () => {
  let component: OtherServiceRequestsEstimationCreationComponent;
  let fixture: ComponentFixture<OtherServiceRequestsEstimationCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OtherServiceRequestsEstimationCreationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherServiceRequestsEstimationCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
