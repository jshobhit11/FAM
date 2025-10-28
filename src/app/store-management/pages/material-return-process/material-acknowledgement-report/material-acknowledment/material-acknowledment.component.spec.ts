import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialAcknowledmentComponent } from './material-acknowledment.component';

describe('MaterialAcknowledmentComponent', () => {
  let component: MaterialAcknowledmentComponent;
  let fixture: ComponentFixture<MaterialAcknowledmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialAcknowledmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialAcknowledmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
