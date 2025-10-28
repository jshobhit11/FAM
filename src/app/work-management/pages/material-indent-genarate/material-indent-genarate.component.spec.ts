import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialIndentGenarateComponent } from './material-indent-genarate.component';

describe('MaterialIndentGenarateComponent', () => {
  let component: MaterialIndentGenarateComponent;
  let fixture: ComponentFixture<MaterialIndentGenarateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialIndentGenarateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialIndentGenarateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
