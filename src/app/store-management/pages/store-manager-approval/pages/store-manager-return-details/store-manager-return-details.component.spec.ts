import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagerReturnDetailsComponent } from './store-manager-return-details.component';

describe('StoreManagerReturnDetailsComponent', () => {
  let component: StoreManagerReturnDetailsComponent;
  let fixture: ComponentFixture<StoreManagerReturnDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreManagerReturnDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreManagerReturnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
