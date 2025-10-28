import { TestBed } from '@angular/core/testing';

import { AlternateMaterialService } from './alternate-material.service';

describe('AlternateMaterialService', () => {
  let service: AlternateMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlternateMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
