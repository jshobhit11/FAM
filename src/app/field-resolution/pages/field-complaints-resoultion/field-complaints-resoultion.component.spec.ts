import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldComplaintsResoultionComponent } from './field-complaints-resoultion.component';

describe('FieldComplaintsResoultionComponent', () => {
  let component: FieldComplaintsResoultionComponent;
  let fixture: ComponentFixture<FieldComplaintsResoultionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldComplaintsResoultionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldComplaintsResoultionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
