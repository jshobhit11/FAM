import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApplicationStatusProcessMappingComponent } from './add-application-status-process-mapping.component';

describe('AddApplicationStatusProcessMappingComponent', () => {
  let component: AddApplicationStatusProcessMappingComponent;
  let fixture: ComponentFixture<AddApplicationStatusProcessMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddApplicationStatusProcessMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApplicationStatusProcessMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
