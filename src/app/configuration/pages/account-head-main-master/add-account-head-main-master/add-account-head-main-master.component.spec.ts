import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountHeadMainMasterComponent } from './add-account-head-main-master.component';

describe('AddAccountHeadMainMasterComponent', () => {
  let component: AddAccountHeadMainMasterComponent;
  let fixture: ComponentFixture<AddAccountHeadMainMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAccountHeadMainMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccountHeadMainMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
