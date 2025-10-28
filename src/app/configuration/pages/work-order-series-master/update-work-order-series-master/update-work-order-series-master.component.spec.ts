import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateWorkOrderSeriesMasterComponent } from './update-work-order-series-master.component';

describe('UpdateWorkOrderSeriesMasterComponent', () => {
  let component: UpdateWorkOrderSeriesMasterComponent;
  let fixture: ComponentFixture<UpdateWorkOrderSeriesMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateWorkOrderSeriesMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateWorkOrderSeriesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
