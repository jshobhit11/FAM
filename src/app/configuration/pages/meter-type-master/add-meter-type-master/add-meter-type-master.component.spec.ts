import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMeterTypeMasterComponent } from './add-meter-type-master.component';

describe('AddMeterTypeMasterComponent', () => {
  let component: AddMeterTypeMasterComponent;
  let fixture: ComponentFixture<AddMeterTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMeterTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMeterTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
