import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QmomEstimationComponent } from './qmom-estimation.component';

describe('QmomEstimationComponent', () => {
  let component: QmomEstimationComponent;
  let fixture: ComponentFixture<QmomEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QmomEstimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QmomEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
