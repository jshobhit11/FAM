import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDelegationPowerMasterComponent } from './update-delegation-power-master.component';

describe('UpdateDelegationPowerMasterComponent', () => {
  let component: UpdateDelegationPowerMasterComponent;
  let fixture: ComponentFixture<UpdateDelegationPowerMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateDelegationPowerMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDelegationPowerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
