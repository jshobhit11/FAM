import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateContractMasterComponent } from './rate-contract-master.component';

describe('RateContractMasterComponent', () => {
  let component: RateContractMasterComponent;
  let fixture: ComponentFixture<RateContractMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateContractMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateContractMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
