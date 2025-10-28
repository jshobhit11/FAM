import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QmomListComponent } from './qmom-list.component';

describe('QmomListComponent', () => {
  let component: QmomListComponent;
  let fixture: ComponentFixture<QmomListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QmomListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QmomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
