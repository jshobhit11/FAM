import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkAwardRequestComponent } from './create-work-award-request.component';

describe('CreateWorkAwardRequestComponent', () => {
  let component: CreateWorkAwardRequestComponent;
  let fixture: ComponentFixture<CreateWorkAwardRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateWorkAwardRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkAwardRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
