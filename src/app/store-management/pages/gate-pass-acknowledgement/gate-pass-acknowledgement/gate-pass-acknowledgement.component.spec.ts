import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatePassAcknowledgementComponent } from './gate-pass-acknowledgement.component';

describe('GatePassAcknowledgementComponent', () => {
  let component: GatePassAcknowledgementComponent;
  let fixture: ComponentFixture<GatePassAcknowledgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GatePassAcknowledgementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GatePassAcknowledgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
