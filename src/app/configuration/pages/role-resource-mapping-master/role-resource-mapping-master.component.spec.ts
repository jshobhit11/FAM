import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleResourceMappingMasterComponent } from './role-resource-mapping-master.component';

describe('RoleResourceMappingMasterComponent', () => {
  let component: RoleResourceMappingMasterComponent;
  let fixture: ComponentFixture<RoleResourceMappingMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleResourceMappingMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleResourceMappingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
