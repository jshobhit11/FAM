import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateWorkExecutionMethodMasterComponent } from './update-work-execution-method.component';

describe('UpdateWorkExecutionMethodMasterComponent', () => {
  let component: UpdateWorkExecutionMethodMasterComponent;
  let fixture: ComponentFixture<UpdateWorkExecutionMethodMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateWorkExecutionMethodMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateWorkExecutionMethodMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
