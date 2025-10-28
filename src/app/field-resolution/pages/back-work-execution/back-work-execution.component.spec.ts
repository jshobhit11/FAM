import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackWorkExecutionComponent } from './back-work-execution.component';

describe('BackWorkExecutionComponent', () => {
  let component: BackWorkExecutionComponent;
  let fixture: ComponentFixture<BackWorkExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackWorkExecutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackWorkExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
