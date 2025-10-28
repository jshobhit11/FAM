import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderSeriesMasterComponent } from './work-order-series-master.component';

describe('WorkOrderSeriesMasterComponent', () => {
  let component: WorkOrderSeriesMasterComponent;
  let fixture: ComponentFixture<WorkOrderSeriesMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkOrderSeriesMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderSeriesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
