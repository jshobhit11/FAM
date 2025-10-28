import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateApplicationStatusProcessMappingComponent } from './update-application-status-process-mapping.component';

describe('UpdateApplicationStatusProcessMappingComponent', () => {
  let component: UpdateApplicationStatusProcessMappingComponent;
  let fixture: ComponentFixture<UpdateApplicationStatusProcessMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateApplicationStatusProcessMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateApplicationStatusProcessMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
