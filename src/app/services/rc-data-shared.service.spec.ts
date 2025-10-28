import { TestBed } from '@angular/core/testing';

import { RcDataSharedService } from './rc-data-shared.service';

describe('RcDataSharedService', () => {
  let service: RcDataSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RcDataSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
