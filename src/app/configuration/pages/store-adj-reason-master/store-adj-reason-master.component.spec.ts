import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAdjReasonMasterComponent } from './store-adj-reason-master.component';

describe('StoreAdjReasonMasterComponent', () => {
  let component: StoreAdjReasonMasterComponent;
  let fixture: ComponentFixture<StoreAdjReasonMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreAdjReasonMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAdjReasonMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
