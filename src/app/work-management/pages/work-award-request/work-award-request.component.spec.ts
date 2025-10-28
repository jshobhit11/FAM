import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAwardRequestComponent } from './work-award-request.component';

describe('WorkAwardRequestComponent', () => {
  let component: WorkAwardRequestComponent;
  let fixture: ComponentFixture<WorkAwardRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkAwardRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkAwardRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
