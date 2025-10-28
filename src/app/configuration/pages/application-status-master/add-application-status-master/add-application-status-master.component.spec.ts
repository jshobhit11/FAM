import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApplicationStatusMasterComponent } from './add-application-status-master.component';

describe('AddApplicationStatusMasterComponent', () => {
  let component: AddApplicationStatusMasterComponent;
  let fixture: ComponentFixture<AddApplicationStatusMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddApplicationStatusMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApplicationStatusMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
