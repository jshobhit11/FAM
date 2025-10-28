import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterChangeDetailsComponent } from './meter-change-details.component';

describe('MeterChangeDetailsComponent', () => {
  let component: MeterChangeDetailsComponent;
  let fixture: ComponentFixture<MeterChangeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterChangeDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterChangeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
