import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnGenerateComponent } from './return-generate.component';

describe('ReturnGenerateComponent', () => {
  let component: ReturnGenerateComponent;
  let fixture: ComponentFixture<ReturnGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnGenerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
