import { TestBed } from '@angular/core/testing';

import { RateContractorService } from './rate-contractor.service';

describe('RateContractorService', () => {
  let service: RateContractorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RateContractorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
