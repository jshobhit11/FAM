import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferSusPopupComponent } from './transfer-sus-popup.component';

describe('TransferSusPopupComponent', () => {
  let component: TransferSusPopupComponent;
  let fixture: ComponentFixture<TransferSusPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferSusPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferSusPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
