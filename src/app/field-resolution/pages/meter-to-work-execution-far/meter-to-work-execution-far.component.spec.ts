import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterToWorkExecutionFarComponent } from './meter-to-work-execution-far.component';

describe('MeterToWorkExecutionFarComponent', () => {
  let component: MeterToWorkExecutionFarComponent;
  let fixture: ComponentFixture<MeterToWorkExecutionFarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterToWorkExecutionFarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterToWorkExecutionFarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
