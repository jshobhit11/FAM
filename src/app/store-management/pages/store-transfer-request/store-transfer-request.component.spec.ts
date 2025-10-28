import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreTransferRequestComponent } from './store-transfer-request.component';

describe('StoreTransferRequestComponent', () => {
  let component: StoreTransferRequestComponent;
  let fixture: ComponentFixture<StoreTransferRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoreTransferRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreTransferRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
