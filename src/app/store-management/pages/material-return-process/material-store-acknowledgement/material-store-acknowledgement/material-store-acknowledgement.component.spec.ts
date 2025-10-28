import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStoreAcknowledgementComponent } from './material-store-acknowledgement.component';

describe('MaterialStoreAcknowledgementComponent', () => {
  let component: MaterialStoreAcknowledgementComponent;
  let fixture: ComponentFixture<MaterialStoreAcknowledgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialStoreAcknowledgementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialStoreAcknowledgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
