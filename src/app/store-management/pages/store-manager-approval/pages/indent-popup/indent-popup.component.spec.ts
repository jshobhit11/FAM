import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentPopupComponent } from './indent-popup.component';

describe('IndentPopupComponent', () => {
  let component: IndentPopupComponent;
  let fixture: ComponentFixture<IndentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
