import { TestBed } from '@angular/core/testing';

import { FieldActivityService } from './field-activity.service';

describe('FieldActivityService', () => {
  let service: FieldActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
