import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupGisContentComponent } from './popup-gis-content.component';

describe('PopupGisContentComponent', () => {
  let component: PopupGisContentComponent;
  let fixture: ComponentFixture<PopupGisContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupGisContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupGisContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
