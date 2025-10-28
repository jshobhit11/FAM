import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAccountHeadMasterComponent } from './update-account-head-master.component';

describe('UpdateAccountHeadMasterComponent', () => {
  let component: UpdateAccountHeadMasterComponent;
  let fixture: ComponentFixture<UpdateAccountHeadMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateAccountHeadMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAccountHeadMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
