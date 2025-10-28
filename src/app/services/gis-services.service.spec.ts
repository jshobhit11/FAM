import { TestBed } from '@angular/core/testing';

import { GisServicesService } from './gis-services.service';

describe('GisServicesService', () => {
  let service: GisServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GisServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
