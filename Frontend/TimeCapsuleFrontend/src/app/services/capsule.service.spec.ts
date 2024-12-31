import { TestBed } from '@angular/core/testing';

import { CapsuleService } from '../capsule.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CapsuleService', () => {
  let service: CapsuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Include HttpClientTestingModule in imports
      providers: [CapsuleService], // Provide CapsuleService explicitly if needed
    });
    service = TestBed.inject(CapsuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
