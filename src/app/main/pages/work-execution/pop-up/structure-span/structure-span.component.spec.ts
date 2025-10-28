import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureSpanComponent } from './structure-span.component';

describe('StructureSpanComponent', () => {
  let component: StructureSpanComponent;
  let fixture: ComponentFixture<StructureSpanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StructureSpanComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureSpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
