import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkOrderSeriesMasterComponent } from './add-work-order-series-master.component';

describe('AddWorkOrderSeriesMasterComponent', () => {
  let component: AddWorkOrderSeriesMasterComponent;
  let fixture: ComponentFixture<AddWorkOrderSeriesMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddWorkOrderSeriesMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkOrderSeriesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
