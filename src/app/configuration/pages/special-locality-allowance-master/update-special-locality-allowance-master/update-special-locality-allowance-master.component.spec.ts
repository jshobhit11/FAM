import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSpecialLocalityAllowanceMasterComponent } from './update-special-locality-allowance-master.component';

describe('UpdateSpecialLocalityAllowanceMasterComponent', () => {
  let component: UpdateSpecialLocalityAllowanceMasterComponent;
  let fixture: ComponentFixture<UpdateSpecialLocalityAllowanceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateSpecialLocalityAllowanceMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSpecialLocalityAllowanceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
