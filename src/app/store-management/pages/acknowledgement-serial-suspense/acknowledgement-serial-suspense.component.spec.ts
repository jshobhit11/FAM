import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgementSerialSuspenseComponent } from './acknowledgement-serial-suspense.component';

describe('AcknowledgementSerialSuspenseComponent', () => {
  let component: AcknowledgementSerialSuspenseComponent;
  let fixture: ComponentFixture<AcknowledgementSerialSuspenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcknowledgementSerialSuspenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcknowledgementSerialSuspenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
