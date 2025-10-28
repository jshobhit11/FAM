import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverPopupComponent } from './receiver-popup.component';

describe('ReceiverPopupComponent', () => {
  let component: ReceiverPopupComponent;
  let fixture: ComponentFixture<ReceiverPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiverPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiverPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
