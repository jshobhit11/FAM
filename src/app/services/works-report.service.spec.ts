import { TestBed } from '@angular/core/testing';

import { WorksReportService } from './works-report.service';

describe('WorksReportService', () => {
  let service: WorksReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorksReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
