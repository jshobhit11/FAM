import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmmSmrFarComponent } from './amm-smr-far.component';

describe('AmmSmrFarComponent', () => {
  let component: AmmSmrFarComponent;
  let fixture: ComponentFixture<AmmSmrFarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmmSmrFarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmmSmrFarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
