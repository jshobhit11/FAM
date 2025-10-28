import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialInspectionComponent } from './material-inspection.component';

describe('MaterialInspectionComponent', () => {
  let component: MaterialInspectionComponent;
  let fixture: ComponentFixture<MaterialInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialInspectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
