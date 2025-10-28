import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectIndentPopupComponent } from './reject-indent-popup.component';

describe('RejectIndentPopupComponent', () => {
  let component: RejectIndentPopupComponent;
  let fixture: ComponentFixture<RejectIndentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectIndentPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectIndentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
