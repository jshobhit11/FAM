import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmployeeMasterComponent } from './update-employee-master.component';

describe('UpdateEmployeeMasterComponent', () => {
  let component: UpdateEmployeeMasterComponent;
  let fixture: ComponentFixture<UpdateEmployeeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateEmployeeMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEmployeeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
