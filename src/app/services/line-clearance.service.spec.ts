import { TestBed } from '@angular/core/testing';

import { LineClearanceService } from './line-clearance.service';

describe('LineClearanceService', () => {
  let service: LineClearanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineClearanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
