import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialAcknowledgementSerialNumberComponent } from './material-acknowledgement-serial-number.component';

describe('MaterialAcknowledgementSerialNumberComponent', () => {
  let component: MaterialAcknowledgementSerialNumberComponent;
  let fixture: ComponentFixture<MaterialAcknowledgementSerialNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialAcknowledgementSerialNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialAcknowledgementSerialNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
