import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionMethodChangeComponent } from './execution-method-change.component';

describe('ExecutionMethodChangeComponent', () => {
  let component: ExecutionMethodChangeComponent;
  let fixture: ComponentFixture<ExecutionMethodChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutionMethodChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionMethodChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
