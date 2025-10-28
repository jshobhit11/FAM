import { TestBed } from '@angular/core/testing';

import { GatePassAcknowledgementService } from './gate-pass-acknowledgement.service';

describe('GatePassAcknowledgementService', () => {
  let service: GatePassAcknowledgementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GatePassAcknowledgementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
