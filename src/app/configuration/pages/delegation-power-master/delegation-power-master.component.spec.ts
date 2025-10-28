import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegationPowerMasterComponent } from './delegation-power-master.component';

describe('DelegationPowerMasterComponent', () => {
  let component: DelegationPowerMasterComponent;
  let fixture: ComponentFixture<DelegationPowerMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegationPowerMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegationPowerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
