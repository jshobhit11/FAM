import { TestBed } from '@angular/core/testing';
import { WorkAwardService } from './work-award.service';

describe('WorkAwardService', () => {
  let service: WorkAwardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkAwardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
