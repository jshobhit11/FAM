import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementWorksFarComponent } from './improvement-works-far.component';

describe('ImprovementWorksFarComponent', () => {
  let component: ImprovementWorksFarComponent;
  let fixture: ComponentFixture<ImprovementWorksFarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprovementWorksFarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementWorksFarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
