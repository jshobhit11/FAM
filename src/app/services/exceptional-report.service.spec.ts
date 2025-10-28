import { TestBed } from '@angular/core/testing';

import { ExceptionalReportService } from './exceptional-report.service';

describe('ExceptionalReportService', () => {
  let service: ExceptionalReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExceptionalReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
