import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountIdMappingScComponent } from './account-id-mapping-sc.component';

describe('AccountIdMappingScComponent', () => {
  let component: AccountIdMappingScComponent;
  let fixture: ComponentFixture<AccountIdMappingScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountIdMappingScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountIdMappingScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
