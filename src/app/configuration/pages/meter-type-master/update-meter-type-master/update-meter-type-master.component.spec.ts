import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMeterTypeMasterComponent } from './update-meter-type-master.component';

describe('UpdateMeterTypeMasterComponent', () => {
  let component: UpdateMeterTypeMasterComponent;
  let fixture: ComponentFixture<UpdateMeterTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMeterTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMeterTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
