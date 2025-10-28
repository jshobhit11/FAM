import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkExecutionMethodMasterComponent } from './add-work-execution-method.component';

describe('AddWorkExecutionMethodMasterComponent', () => {
  let component: AddWorkExecutionMethodMasterComponent;
  let fixture: ComponentFixture<AddWorkExecutionMethodMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddWorkExecutionMethodMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkExecutionMethodMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
