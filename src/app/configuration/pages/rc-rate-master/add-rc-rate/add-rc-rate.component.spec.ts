import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRcRateComponent } from './add-rc-rate.component';

describe('AddRcRateComponent', () => {
  let component: AddRcRateComponent;
  let fixture: ComponentFixture<AddRcRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRcRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRcRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
