import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureBlockComponent } from './structure-block.component';

describe('StructureBlockComponent', () => {
  let component: StructureBlockComponent;
  let fixture: ComponentFixture<StructureBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StructureBlockComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
