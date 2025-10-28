import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialYearMasterComponent } from './financial-year-master.component';

describe('FinancialYearMasterComponent', () => {
  let component: FinancialYearMasterComponent;
  let fixture: ComponentFixture<FinancialYearMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialYearMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialYearMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
