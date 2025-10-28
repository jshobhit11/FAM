import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDopCategoryComponent } from './change-dop-category.component';

describe('ChangeDopCategoryComponent', () => {
  let component: ChangeDopCategoryComponent;
  let fixture: ComponentFixture<ChangeDopCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeDopCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDopCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
