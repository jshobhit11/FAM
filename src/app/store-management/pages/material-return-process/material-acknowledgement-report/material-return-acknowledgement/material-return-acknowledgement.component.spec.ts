import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialReturnAcknowledgementComponent } from './material-return-acknowledgement.component';

describe('MaterialReturnAcknowledgementComponent', () => {
  let component: MaterialReturnAcknowledgementComponent;
  let fixture: ComponentFixture<MaterialReturnAcknowledgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialReturnAcknowledgementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialReturnAcknowledgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
