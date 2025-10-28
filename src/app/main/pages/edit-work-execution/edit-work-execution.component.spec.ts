import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkExecutionComponent } from './edit-work-execution.component';

describe('EditWorkExecutionComponent', () => {
  let component: EditWorkExecutionComponent;
  let fixture: ComponentFixture<EditWorkExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditWorkExecutionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorkExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
