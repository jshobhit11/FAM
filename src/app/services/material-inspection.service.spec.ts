import { TestBed } from '@angular/core/testing';

import { MaterialInspectionService } from './material-inspection.service';

describe('MaterialInspectionService', () => {
  let service: MaterialInspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialInspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
