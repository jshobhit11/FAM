import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountHeadMasterComponent } from './add-account-head-master.component';

describe('AddAccountHeadMasterComponent', () => {
  let component: AddAccountHeadMasterComponent;
  let fixture: ComponentFixture<AddAccountHeadMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAccountHeadMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccountHeadMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
