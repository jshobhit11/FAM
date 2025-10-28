import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpecialLocalityAllowanceMasterComponent } from './add-special-locality-allowance-master.component';

describe('AddSpecialLocalityAllowanceMasterComponent', () => {
  let component: AddSpecialLocalityAllowanceMasterComponent;
  let fixture: ComponentFixture<AddSpecialLocalityAllowanceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSpecialLocalityAllowanceMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSpecialLocalityAllowanceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
