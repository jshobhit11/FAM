import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagerSuspenseDetailsComponent } from './store-manager-suspense-details.component';

describe('StoreManagerSuspenseDetailsComponent', () => {
  let component: StoreManagerSuspenseDetailsComponent;
  let fixture: ComponentFixture<StoreManagerSuspenseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreManagerSuspenseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreManagerSuspenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
