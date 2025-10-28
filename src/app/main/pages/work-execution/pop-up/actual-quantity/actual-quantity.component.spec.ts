import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualQuantityComponent } from './actual-quantity.component';

describe('ActualQuantityComponent', () => {
  let component: ActualQuantityComponent;
  let fixture: ComponentFixture<ActualQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActualQuantityComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
