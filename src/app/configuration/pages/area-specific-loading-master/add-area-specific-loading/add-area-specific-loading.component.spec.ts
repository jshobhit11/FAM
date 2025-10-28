import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAreaSpecificLoadingComponent } from './add-area-specific-loading.component';

describe('AddAreaSpecificLoadingComponent', () => {
  let component: AddAreaSpecificLoadingComponent;
  let fixture: ComponentFixture<AddAreaSpecificLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAreaSpecificLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAreaSpecificLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
