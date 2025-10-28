import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcListComponent } from './pc-list.component';

describe('PcListComponent', () => {
  let component: PcListComponent;
  let fixture: ComponentFixture<PcListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
