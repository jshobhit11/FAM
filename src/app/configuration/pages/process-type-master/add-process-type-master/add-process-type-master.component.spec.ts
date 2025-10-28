import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProcessTypeMasterComponent } from './add-process-type-master.component';

describe('AddProcessTypeMasterComponent', () => {
  let component: AddProcessTypeMasterComponent;
  let fixture: ComponentFixture<AddProcessTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProcessTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProcessTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
