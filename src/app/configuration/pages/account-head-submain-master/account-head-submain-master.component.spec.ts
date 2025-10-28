import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountHeadSubmainMasterComponent } from './account-head-submain-master.component';

describe('AccountHeadSubmainMasterComponent', () => {
  let component: AccountHeadSubmainMasterComponent;
  let fixture: ComponentFixture<AccountHeadSubmainMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountHeadSubmainMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountHeadSubmainMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
