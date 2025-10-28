import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterTypeMasterComponent } from './meter-type-master.component';

describe('MeterTypeMasterComponent', () => {
  let component: MeterTypeMasterComponent;
  let fixture: ComponentFixture<MeterTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
