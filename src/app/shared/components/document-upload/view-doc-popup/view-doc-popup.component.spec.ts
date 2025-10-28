import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewDocPopupComponent } from './view-doc-popup.component';


describe('ViewDocPopupComponent', () => {
  let component: ViewDocPopupComponent;
  let fixture: ComponentFixture<ViewDocPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDocPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDocPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
