import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDesignationMasterComponent } from './update-designation-master.component';

describe('UpdateDesignationMasterComponent', () => {
  let component: UpdateDesignationMasterComponent;
  let fixture: ComponentFixture<UpdateDesignationMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateDesignationMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDesignationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
