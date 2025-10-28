import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterReplicateAndValidateComponent } from './meter-replicate-and-validate.component';

describe('MeterReplicateAndValidateComponent', () => {
  let component: MeterReplicateAndValidateComponent;
  let fixture: ComponentFixture<MeterReplicateAndValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterReplicateAndValidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterReplicateAndValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
