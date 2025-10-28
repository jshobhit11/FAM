import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatePassAcknowledgementDetailsComponent } from './gate-pass-acknowledgement-details.component';

describe('GatePassAcknowledgementDetailsComponent', () => {
  let component: GatePassAcknowledgementDetailsComponent;
  let fixture: ComponentFixture<GatePassAcknowledgementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GatePassAcknowledgementDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GatePassAcknowledgementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
