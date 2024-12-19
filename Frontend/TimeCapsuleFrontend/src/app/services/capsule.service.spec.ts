import { TestBed } from '@angular/core/testing';

import { CapsuleService } from './services/capsule.service';

describe('CapsuleService', () => {
  let service: CapsuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapsuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
