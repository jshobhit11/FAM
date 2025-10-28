import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByAccountIdComponent } from './search-by-account-id.component';

describe('SearchByAccountIdComponent', () => {
  let component: SearchByAccountIdComponent;
  let fixture: ComponentFixture<SearchByAccountIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchByAccountIdComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByAccountIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
