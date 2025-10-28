import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialSuspenseAcknowledgementComponent } from './material-suspense-acknowledgement.component';

describe('MaterialSuspenseAcknowledgementComponent', () => {
  let component: MaterialSuspenseAcknowledgementComponent;
  let fixture: ComponentFixture<MaterialSuspenseAcknowledgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialSuspenseAcknowledgementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialSuspenseAcknowledgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
