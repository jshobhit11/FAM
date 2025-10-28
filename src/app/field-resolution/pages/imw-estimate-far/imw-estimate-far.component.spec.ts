import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImwEstimateFarComponent } from './imw-estimate-far.component';

describe('ImwEstimateFarComponent', () => {
  let component: ImwEstimateFarComponent;
  let fixture: ComponentFixture<ImwEstimateFarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImwEstimateFarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImwEstimateFarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
