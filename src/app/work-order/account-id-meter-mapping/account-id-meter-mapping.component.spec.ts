import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountIdMeterMappingComponent } from './account-id-meter-mapping.component';

describe('AccountIdMeterMappingComponent', () => {
  let component: AccountIdMeterMappingComponent;
  let fixture: ComponentFixture<AccountIdMeterMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountIdMeterMappingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountIdMeterMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
