import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFinancialYearMasterComponent } from './add-financial-year-master.component';

describe('AddFinancialYearMasterComponent', () => {
  let component: AddFinancialYearMasterComponent;
  let fixture: ComponentFixture<AddFinancialYearMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFinancialYearMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFinancialYearMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
