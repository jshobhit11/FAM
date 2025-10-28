import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountHeadMainMasterComponent } from './account-head-main-master.component';

describe('AccountHeadMainMasterComponent', () => {
  let component: AccountHeadMainMasterComponent;
  let fixture: ComponentFixture<AccountHeadMainMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountHeadMainMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountHeadMainMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
