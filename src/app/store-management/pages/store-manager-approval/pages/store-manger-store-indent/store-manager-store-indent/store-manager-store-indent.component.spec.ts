import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagerStoreIndentComponent } from './store-manager-store-indent.component';

describe('StoreManagerStoreIndentComponent', () => {
  let component: StoreManagerStoreIndentComponent;
  let fixture: ComponentFixture<StoreManagerStoreIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreManagerStoreIndentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreManagerStoreIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
