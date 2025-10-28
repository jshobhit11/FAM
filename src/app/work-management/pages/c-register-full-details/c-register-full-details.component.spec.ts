import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRegisterFullDetailsComponent } from './c-register-full-details.component';

describe('CRegisterFullDetailsComponent', () => {
  let component: CRegisterFullDetailsComponent;
  let fixture: ComponentFixture<CRegisterFullDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CRegisterFullDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CRegisterFullDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
