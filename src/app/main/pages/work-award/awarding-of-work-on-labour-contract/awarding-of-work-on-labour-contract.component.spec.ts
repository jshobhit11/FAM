import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardingOfWorkOnLabourContractComponent } from './awarding-of-work-on-labour-contract.component';

describe('AwardingOfWorkOnLabourContractComponent', () => {
  let component: AwardingOfWorkOnLabourContractComponent;
  let fixture: ComponentFixture<AwardingOfWorkOnLabourContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AwardingOfWorkOnLabourContractComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardingOfWorkOnLabourContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
