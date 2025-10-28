import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldResolutionSideNavComponent } from './field-resolution-side-nav.component';

describe('FieldResolutionSideNavComponent', () => {
  let component: FieldResolutionSideNavComponent;
  let fixture: ComponentFixture<FieldResolutionSideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldResolutionSideNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldResolutionSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
