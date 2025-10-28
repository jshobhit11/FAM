import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkExecutionMethodMasterComponent } from './work-execution-method.component';

describe('WorkExecutionMethodComponent', () => {
  let component: WorkExecutionMethodMasterComponent;
  let fixture: ComponentFixture<WorkExecutionMethodMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkExecutionMethodMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkExecutionMethodMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
