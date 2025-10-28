import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterMcFarComponent } from './meter-mc-far.component';

describe('MeterMcFarComponent', () => {
  let component: MeterMcFarComponent;
  let fixture: ComponentFixture<MeterMcFarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterMcFarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterMcFarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
