import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleAccountMeterReplacemantComponent } from './multiple-account-meter-replacemant.component';

describe('MultipleAccountMeterReplacemantComponent', () => {
  let component: MultipleAccountMeterReplacemantComponent;
  let fixture: ComponentFixture<MultipleAccountMeterReplacemantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleAccountMeterReplacemantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleAccountMeterReplacemantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
