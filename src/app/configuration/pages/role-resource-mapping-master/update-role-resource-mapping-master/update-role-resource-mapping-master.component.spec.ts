import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRoleResourceMappingMasterComponent } from './update-role-resource-mapping-master.component';

describe('UpdateRoleResourceMappingMasterComponent', () => {
  let component: UpdateRoleResourceMappingMasterComponent;
  let fixture: ComponentFixture<UpdateRoleResourceMappingMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRoleResourceMappingMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRoleResourceMappingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
