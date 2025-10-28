import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterReplacementFarComponent } from './meter-replacement-far.component';

describe('MeterReplacementFarComponent', () => {
  let component: MeterReplacementFarComponent;
  let fixture: ComponentFixture<MeterReplacementFarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterReplacementFarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterReplacementFarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
