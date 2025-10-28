import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkExecutionMaterialComponent } from './work-execution-material.component';

describe('WorkExecutionMaterialComponent', () => {
  let component: WorkExecutionMaterialComponent;
  let fixture: ComponentFixture<WorkExecutionMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkExecutionMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkExecutionMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
