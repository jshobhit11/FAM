import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QmmtListComponent } from './qmmt-list.component';

describe('QmmtListComponent', () => {
  let component: QmmtListComponent;
  let fixture: ComponentFixture<QmmtListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QmmtListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QmmtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
