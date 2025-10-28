import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspenseGenerateComponent } from './suspense-generate.component';

describe('SuspenseGenerateComponent', () => {
  let component: SuspenseGenerateComponent;
  let fixture: ComponentFixture<SuspenseGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuspenseGenerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspenseGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
