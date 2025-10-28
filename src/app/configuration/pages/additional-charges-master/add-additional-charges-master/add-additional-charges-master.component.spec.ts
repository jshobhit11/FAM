import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdditionalChargesMasterComponent } from './add-additional-charges-master.component';

describe('AddAdditionalChargesMasterComponent', () => {
  let component: AddAdditionalChargesMasterComponent;
  let fixture: ComponentFixture<AddAdditionalChargesMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAdditionalChargesMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdditionalChargesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
