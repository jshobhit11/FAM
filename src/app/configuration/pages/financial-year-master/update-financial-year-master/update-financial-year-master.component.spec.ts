import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFinancialYearMasterComponent } from './update-financial-year-master.component';

describe('UpdateFinancialYearMasterComponent', () => {
  let component: UpdateFinancialYearMasterComponent;
  let fixture: ComponentFixture<UpdateFinancialYearMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFinancialYearMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFinancialYearMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
