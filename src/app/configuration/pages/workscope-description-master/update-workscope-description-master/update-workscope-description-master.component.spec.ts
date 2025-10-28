import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateWorkscopeDescriptionMasterComponent } from './update-workscope-description-master.component';

describe('UpdateWorkscopeDescriptionMasterComponent', () => {
  let component: UpdateWorkscopeDescriptionMasterComponent;
  let fixture: ComponentFixture<UpdateWorkscopeDescriptionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateWorkscopeDescriptionMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateWorkscopeDescriptionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
