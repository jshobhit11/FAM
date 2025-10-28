import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationStatusMasterComponent } from './application-status-master.component';

describe('ApplicationStatusMasterComponent', () => {
  let component: ApplicationStatusMasterComponent;
  let fixture: ComponentFixture<ApplicationStatusMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationStatusMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationStatusMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
