import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConnectionTypeMasterComponent } from './add-connection-type-master.component';

describe('AddConnectionTypeMasterComponent', () => {
  let component: AddConnectionTypeMasterComponent;
  let fixture: ComponentFixture<AddConnectionTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddConnectionTypeMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConnectionTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
