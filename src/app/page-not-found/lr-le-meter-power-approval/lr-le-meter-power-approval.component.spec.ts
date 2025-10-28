import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LrLeMeterPowerApprovalComponent } from './lr-le-meter-power-approval.component';

describe('LrLeMeterPowerApprovalComponent', () => {
  let component: LrLeMeterPowerApprovalComponent;
  let fixture: ComponentFixture<LrLeMeterPowerApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LrLeMeterPowerApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LrLeMeterPowerApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
