import { TestBed } from '@angular/core/testing';

import { UploadMaterialService } from './upload-material.service';

describe('UploadMaterialService', () => {
  let service: UploadMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
