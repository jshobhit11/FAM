import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApplicationTypeMasterComponent } from './add-application-type-master.component';

describe('AddApplicationTypeMasterComponent', () => {
  let component: AddApplicationTypeMasterComponent;
  let fixture: ComponentFixture<AddApplicationTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddApplicationTypeMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApplicationTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
