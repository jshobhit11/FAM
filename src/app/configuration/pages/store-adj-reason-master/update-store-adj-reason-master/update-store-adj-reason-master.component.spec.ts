import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStoreAdjReasonMasterComponent } from './update-store-adj-reason-master.component';

describe('UpdateStoreAdjReasonMasterComponent', () => {
  let component: UpdateStoreAdjReasonMasterComponent;
  let fixture: ComponentFixture<UpdateStoreAdjReasonMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateStoreAdjReasonMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStoreAdjReasonMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
