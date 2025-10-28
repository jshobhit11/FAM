import { TestBed } from '@angular/core/testing';

import { CRegisteredService } from './c-registered.service';

describe('CRegisteredService', () => {
  let service: CRegisteredService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CRegisteredService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
