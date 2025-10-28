import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineExtChangeComponent } from './line-ext-change.component';

describe('LineExtChangeComponent', () => {
  let component: LineExtChangeComponent;
  let fixture: ComponentFixture<LineExtChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineExtChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineExtChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
