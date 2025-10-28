import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcRateComponent } from './rc-rate.component';

describe('RcRateComponent', () => {
  let component: RcRateComponent;
  let fixture: ComponentFixture<RcRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RcRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
