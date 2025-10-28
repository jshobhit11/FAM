import { TestBed } from '@angular/core/testing';

import { BmrReportsService } from './bmr-reports.service';

describe('BmrReportsService', () => {
  let service: BmrReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BmrReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
