import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRejectedWorksComponent } from './maintenance-rejected-works.component';

describe('MaintenanceRejectedWorksComponent', () => {
  let component: MaintenanceRejectedWorksComponent;
  let fixture: ComponentFixture<MaintenanceRejectedWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceRejectedWorksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceRejectedWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
