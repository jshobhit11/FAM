import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoleResourceMappingMasterComponent } from './add-role-resource-mapping-master.component';

describe('AddRoleResourceMappingMasterComponent', () => {
  let component: AddRoleResourceMappingMasterComponent;
  let fixture: ComponentFixture<AddRoleResourceMappingMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRoleResourceMappingMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoleResourceMappingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
