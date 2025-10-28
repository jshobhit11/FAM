import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgementDetailsComponent } from './acknowledgement-details.component';

describe('AcknowledgementDetailsComponent', () => {
  let component: AcknowledgementDetailsComponent;
  let fixture: ComponentFixture<AcknowledgementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcknowledgementDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcknowledgementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
