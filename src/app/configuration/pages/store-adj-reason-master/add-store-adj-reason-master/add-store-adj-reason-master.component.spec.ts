import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoreAdjReasonMasterComponent } from './add-store-adj-reason-master.component';

describe('AddStoreAdjReasonMasterComponent', () => {
  let component: AddStoreAdjReasonMasterComponent;
  let fixture: ComponentFixture<AddStoreAdjReasonMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStoreAdjReasonMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStoreAdjReasonMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
