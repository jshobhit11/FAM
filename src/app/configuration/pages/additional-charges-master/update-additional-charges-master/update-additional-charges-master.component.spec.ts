import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAdditionalChargesMasterComponent } from './update-additional-charges-master.component';

describe('UpdateAdditionalChargesMasterComponent', () => {
  let component: UpdateAdditionalChargesMasterComponent;
  let fixture: ComponentFixture<UpdateAdditionalChargesMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateAdditionalChargesMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAdditionalChargesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
