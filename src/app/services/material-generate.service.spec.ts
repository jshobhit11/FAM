import { TestBed } from '@angular/core/testing';

import { MaterialGenerateService } from './material-generate.service';

describe('MaterialGenerateService', () => {
  let service: MaterialGenerateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialGenerateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
