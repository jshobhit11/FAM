import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDesignationMasterComponent } from './add-designation-master.component';

describe('AddDesignationMasterComponent', () => {
  let component: AddDesignationMasterComponent;
  let fixture: ComponentFixture<AddDesignationMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDesignationMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDesignationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
