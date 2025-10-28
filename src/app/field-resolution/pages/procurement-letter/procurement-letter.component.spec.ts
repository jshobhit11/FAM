import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementLetterComponent } from './procurement-letter.component';

describe('ProcurementLetterComponent', () => {
  let component: ProcurementLetterComponent;
  let fixture: ComponentFixture<ProcurementLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurementLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
