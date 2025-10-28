import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRcRateComponent } from './update-rc-rate.component';

describe('UpdateRcRateComponent', () => {
  let component: UpdateRcRateComponent;
  let fixture: ComponentFixture<UpdateRcRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRcRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRcRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
