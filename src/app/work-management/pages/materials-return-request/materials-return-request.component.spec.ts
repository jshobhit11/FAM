import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsReturnRequestComponent } from './materials-return-request.component';

describe('MaterialsReturnRequestComponent', () => {
  let component: MaterialsReturnRequestComponent;
  let fixture: ComponentFixture<MaterialsReturnRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialsReturnRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsReturnRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
