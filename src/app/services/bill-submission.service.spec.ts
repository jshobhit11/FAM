import { TestBed } from '@angular/core/testing';

import { BillSubmissionService } from './bill-submission.service';

describe('BillSubmissionService', () => {
  let service: BillSubmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillSubmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
