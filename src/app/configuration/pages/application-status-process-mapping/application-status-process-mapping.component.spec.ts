import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationStatusProcessMappingComponent } from './application-status-process-mapping.component';

describe('ApplicationStatusProcessMappingComponent', () => {
  let component: ApplicationStatusProcessMappingComponent;
  let fixture: ComponentFixture<ApplicationStatusProcessMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationStatusProcessMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationStatusProcessMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
