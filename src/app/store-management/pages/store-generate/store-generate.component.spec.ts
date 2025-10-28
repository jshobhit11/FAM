import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreGenerateComponent } from './store-generate.component';

describe('StoreGenerateComponent', () => {
  let component: StoreGenerateComponent;
  let fixture: ComponentFixture<StoreGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreGenerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
