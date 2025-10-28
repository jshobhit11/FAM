import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSanctionComponent } from './power-sanction.component';

describe('PowerSanctionComponent', () => {
  let component: PowerSanctionComponent;
  let fixture: ComponentFixture<PowerSanctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerSanctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerSanctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
