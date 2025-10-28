import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterBmrFarComponent } from './meter-bmr-far.component';

describe('MeterBmrFarComponent', () => {
  let component: MeterBmrFarComponent;
  let fixture: ComponentFixture<MeterBmrFarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterBmrFarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterBmrFarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
