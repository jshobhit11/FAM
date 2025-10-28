import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDelegationPowerMasterComponent } from './add-delegation-power-master.component';

describe('AddDelegationPowerMasterComponent', () => {
  let component: AddDelegationPowerMasterComponent;
  let fixture: ComponentFixture<AddDelegationPowerMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDelegationPowerMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDelegationPowerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
