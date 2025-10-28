import { TestBed } from '@angular/core/testing';

import { AssignCrewService } from './assign-crew.service';

describe('AssignCrewService', () => {
  let service: AssignCrewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignCrewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
