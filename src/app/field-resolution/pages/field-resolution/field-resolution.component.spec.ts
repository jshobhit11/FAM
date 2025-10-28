import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldResolutionComponent } from './field-resolution.component';

describe('FieldResolutionComponent', () => {
  let component: FieldResolutionComponent;
  let fixture: ComponentFixture<FieldResolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldResolutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldResolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
