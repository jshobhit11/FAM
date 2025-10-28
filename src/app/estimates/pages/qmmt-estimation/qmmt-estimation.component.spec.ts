import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QmmtEstimationComponent } from './qmmt-estimation.component';

describe('QmmtEstimationComponent', () => {
  let component: QmmtEstimationComponent;
  let fixture: ComponentFixture<QmmtEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QmmtEstimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QmmtEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
