import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkExecutionDetailsComponent } from './work-execution-details.component';

describe('WorkExecutionDetailsComponent', () => {
  let component: WorkExecutionDetailsComponent;
  let fixture: ComponentFixture<WorkExecutionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkExecutionDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkExecutionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
