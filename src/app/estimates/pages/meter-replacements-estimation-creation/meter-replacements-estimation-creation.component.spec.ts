import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterReplacementsEstimationCreationComponent } from './meter-replacements-estimation-creation.component';

describe('MeterReplacementsEstimationCreationComponent', () => {
  let component: MeterReplacementsEstimationCreationComponent;
  let fixture: ComponentFixture<MeterReplacementsEstimationCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeterReplacementsEstimationCreationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterReplacementsEstimationCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
