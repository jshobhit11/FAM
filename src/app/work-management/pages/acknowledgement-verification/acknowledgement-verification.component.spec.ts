import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgementVerificationComponent } from './acknowledgement-verification.component';

describe('AcknowledgementVerificationComponent', () => {
  let component: AcknowledgementVerificationComponent;
  let fixture: ComponentFixture<AcknowledgementVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcknowledgementVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcknowledgementVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
