import { TestBed } from '@angular/core/testing';

import { WorkCompletionService } from './work-completion.service';

describe('WorkCompletionService', () => {
  let service: WorkCompletionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkCompletionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
