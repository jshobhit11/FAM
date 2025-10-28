import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkExecutionComponent } from './work-execution.component';

describe('WorkExecutionComponent', () => {
  let component: WorkExecutionComponent;
  let fixture: ComponentFixture<WorkExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkExecutionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
