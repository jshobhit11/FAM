import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAccountMeterReplacemantComponent } from './single-account-meter-replacemant.component';

describe('SingleAccountMeterReplacemantComponent', () => {
  let component: SingleAccountMeterReplacemantComponent;
  let fixture: ComponentFixture<SingleAccountMeterReplacemantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleAccountMeterReplacemantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleAccountMeterReplacemantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
