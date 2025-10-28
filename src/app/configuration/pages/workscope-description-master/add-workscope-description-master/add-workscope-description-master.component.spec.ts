import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkscopeDescriptionMasterComponent } from './add-workscope-description-master.component';

describe('AddWorkscopeDescriptionMasterComponent', () => {
  let component: AddWorkscopeDescriptionMasterComponent;
  let fixture: ComponentFixture<AddWorkscopeDescriptionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddWorkscopeDescriptionMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkscopeDescriptionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
