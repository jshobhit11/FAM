import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialLocalityAllowanceMasterComponent } from './special-locality-allowance-master.component';

describe('SpecialLocalityAllowanceMasterComponent', () => {
  let component: SpecialLocalityAllowanceMasterComponent;
  let fixture: ComponentFixture<SpecialLocalityAllowanceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecialLocalityAllowanceMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialLocalityAllowanceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
