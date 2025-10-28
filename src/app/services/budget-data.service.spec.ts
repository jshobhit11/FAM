import { TestBed } from '@angular/core/testing';

import { BudgetDataService } from './budget-data.service';

describe('BudgetDataService', () => {
  let service: BudgetDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
