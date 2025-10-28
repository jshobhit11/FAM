import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRegisteredDetailComponent } from './c-registered-detail.component';

describe('CRegisteredDetailComponent', () => {
  let component: CRegisteredDetailComponent;
  let fixture: ComponentFixture<CRegisteredDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CRegisteredDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CRegisteredDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
