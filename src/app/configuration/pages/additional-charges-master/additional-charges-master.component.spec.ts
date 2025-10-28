import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalChargesMasterComponent } from './additional-charges-master.component';

describe('AdditionalChargesMasterComponent', () => {
  let component: AdditionalChargesMasterComponent;
  let fixture: ComponentFixture<AdditionalChargesMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalChargesMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalChargesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
