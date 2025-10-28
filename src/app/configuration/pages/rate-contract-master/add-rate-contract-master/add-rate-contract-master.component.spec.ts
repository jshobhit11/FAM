import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRateContractMasterComponent } from './add-rate-contract-master.component';

describe('AddRateContractMasterComponent', () => {
  let component: AddRateContractMasterComponent;
  let fixture: ComponentFixture<AddRateContractMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRateContractMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRateContractMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
