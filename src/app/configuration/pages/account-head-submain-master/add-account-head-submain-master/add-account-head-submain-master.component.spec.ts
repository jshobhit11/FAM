import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountHeadSubmainMasterComponent } from './add-account-head-submain-master.component';

describe('AddAccountHeadSubmainMasterComponent', () => {
  let component: AddAccountHeadSubmainMasterComponent;
  let fixture: ComponentFixture<AddAccountHeadSubmainMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAccountHeadSubmainMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccountHeadSubmainMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
