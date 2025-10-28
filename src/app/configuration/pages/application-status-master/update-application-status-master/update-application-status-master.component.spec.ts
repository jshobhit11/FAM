import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateApplicationStatusMasterComponent } from './update-application-status-master.component';

describe('UpdateApplicationStatusMasterComponent', () => {
  let component: UpdateApplicationStatusMasterComponent;
  let fixture: ComponentFixture<UpdateApplicationStatusMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateApplicationStatusMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateApplicationStatusMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
