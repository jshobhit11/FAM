import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMeterToMeterUploadComponent } from './account-meter-to-meter-upload.component';

describe('AccountMeterToMeterUploadComponent', () => {
  let component: AccountMeterToMeterUploadComponent;
  let fixture: ComponentFixture<AccountMeterToMeterUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountMeterToMeterUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMeterToMeterUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
