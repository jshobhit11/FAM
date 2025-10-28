import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterChangeDetailsScComponent } from './meter-change-details-sc.component';

describe('MeterChangeDetailsScComponent', () => {
  let component: MeterChangeDetailsScComponent;
  let fixture: ComponentFixture<MeterChangeDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterChangeDetailsScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterChangeDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
