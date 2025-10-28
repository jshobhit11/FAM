import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowReturnComponent } from './acknow-return.component';

describe('AcknowReturnComponent', () => {
  let component: AcknowReturnComponent;
  let fixture: ComponentFixture<AcknowReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcknowReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcknowReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
