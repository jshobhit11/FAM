import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAccountHeadSubmainMasterComponent } from './update-account-head-submain-master.component';

describe('UpdateAccountHeadSubmainMasterComponent', () => {
  let component: UpdateAccountHeadSubmainMasterComponent;
  let fixture: ComponentFixture<UpdateAccountHeadSubmainMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateAccountHeadSubmainMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAccountHeadSubmainMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
