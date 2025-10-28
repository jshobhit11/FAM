import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRateContractMasterComponent } from './update-rate-contract-master.component';

describe('UpdateRateContractMasterComponent', () => {
  let component: UpdateRateContractMasterComponent;
  let fixture: ComponentFixture<UpdateRateContractMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRateContractMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRateContractMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
