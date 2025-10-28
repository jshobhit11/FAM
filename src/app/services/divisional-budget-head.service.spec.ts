import { TestBed } from '@angular/core/testing';

import { DivisionalBudgetHeadService } from './divisional-budget-head.service';

describe('DivisionalBudgetHeadService', () => {
  let service: DivisionalBudgetHeadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DivisionalBudgetHeadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
