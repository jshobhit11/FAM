import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmrCaseFarComponent } from './smr-case-far.component';

describe('SmrCaseFarComponent', () => {
  let component: SmrCaseFarComponent;
  let fixture: ComponentFixture<SmrCaseFarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmrCaseFarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmrCaseFarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
