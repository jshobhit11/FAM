import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoreMasterComponent } from './add-store-master.component';

describe('AddStoreMasterComponent', () => {
  let component: AddStoreMasterComponent;
  let fixture: ComponentFixture<AddStoreMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddStoreMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStoreMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
