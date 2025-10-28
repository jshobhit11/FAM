import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderCreationAetComponent } from './work-order-creation-aet.component';

describe('WorkOrderCreationAetComponent', () => {
  let component: WorkOrderCreationAetComponent;
  let fixture: ComponentFixture<WorkOrderCreationAetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderCreationAetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderCreationAetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
