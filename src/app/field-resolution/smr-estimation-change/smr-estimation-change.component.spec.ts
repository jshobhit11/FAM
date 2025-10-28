import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmrEstimationChangeComponent } from './smr-estimation-change.component';

describe('SmrEstimationChangeComponent', () => {
  let component: SmrEstimationChangeComponent;
  let fixture: ComponentFixture<SmrEstimationChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmrEstimationChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmrEstimationChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
