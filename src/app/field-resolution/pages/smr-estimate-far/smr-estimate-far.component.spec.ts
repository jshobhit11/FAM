import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmrEstimateFarComponent } from './smr-estimate-far.component';

describe('SmrEstimateFarComponent', () => {
  let component: SmrEstimateFarComponent;
  let fixture: ComponentFixture<SmrEstimateFarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmrEstimateFarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmrEstimateFarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
