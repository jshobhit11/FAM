import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAccountHeadMainMasterComponent } from './update-account-head-main-master.component';

describe('UpdateAccountHeadMainMasterComponent', () => {
  let component: UpdateAccountHeadMainMasterComponent;
  let fixture: ComponentFixture<UpdateAccountHeadMainMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateAccountHeadMainMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAccountHeadMainMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
