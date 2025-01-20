import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CapsuleService, Capsule, Tag } from './capsule.service';

describe('CapsuleService', () => {
  let service: CapsuleService;
  let httpMock: HttpTestingController;

  const mockCapsules: Capsule[] = [
    {
      capsuleID: 1,
      title: 'Test Capsule 1',
      message: 'This is a test message',
      lockDate: '2025-01-01',
      status: 'Open',
      senderID: 101,
      recipientID: 202,
      senderUsername: 'sender1',
      recipientUsername: 'recipient1',
      tags: [{ tagID: 1, tagName: 'Tag1' }],
    },
  ];

  const mockTags: Tag[] = [
    { tagID: 1, tagName: 'Tag1' },
    { tagID: 2, tagName: 'Tag2' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CapsuleService],
    });
    service = TestBed.inject(CapsuleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('deleteCapsule', () => {
    it('should delete a capsule by ID', () => {
      const capsuleID = 1;

      service.deleteCapsule(capsuleID).subscribe((response) => {
        expect(response).toBeNull(); // Hardcoded to expect null for success
      });

      const req = httpMock.expectOne(`http://localhost:5062/api/capsules/${capsuleID}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null); // Simulate null response
    });
  });

  describe('getCapsules', () => {
    it('should retrieve a list of capsules', () => {
      service.getCapsules().subscribe((capsules) => {
        expect(capsules).toEqual(mockCapsules);
      });

      const req = httpMock.expectOne('http://localhost:5062/api/capsules');
      expect(req.request.method).toBe('GET');
      req.flush(mockCapsules); // Simulate HTTP response
    });
  });

  describe('createCapsule', () => {
    it('should create a new capsule', () => {
      const newCapsule: Capsule = {
        capsuleID: 3,
        title: 'New Capsule',
        message: 'This is a new test capsule',
        lockDate: '2025-12-31',
        status: 'Open',
        senderID: 103,
        recipientID: 202,
        senderUsername: 'sender3',
        recipientUsername: 'recipient3',
        tags: [],
      };

      service.createCapsule(newCapsule).subscribe((capsule) => {
        expect(capsule).toEqual(newCapsule);
      });

      const req = httpMock.expectOne('http://localhost:5062/api/capsules');
      expect(req.request.method).toBe('POST');
      req.flush(newCapsule); // Simulate HTTP response
    });
  });

  describe('getTags', () => {
    it('should retrieve a list of tags', () => {
      service.getTags().subscribe((tags) => {
        expect(tags).toEqual(mockTags);
      });

      const req = httpMock.expectOne('http://localhost:5062/api/tags');
      expect(req.request.method).toBe('GET');
      req.flush(mockTags); // Simulate HTTP response
    });
  });

  describe('addTagsToCapsule', () => {
    it('should add tags to a capsule', () => {
      const capsuleID = 1;
      const tagIDs = [1, 2];

      spyOn(console, 'log'); // Spy on console.log for verification

      service.addTagsToCapsule(capsuleID, tagIDs);

      tagIDs.forEach((tagID) => {
        const req = httpMock.expectOne(`http://localhost:5062/api/capsuletags/${capsuleID}/${tagID}`);
        expect(req.request.method).toBe('POST');
        req.flush(null); // Simulate HTTP response
      });

      expect(console.log).toHaveBeenCalledWith(`Tag with ID 1 added to Capsule with ID 1`);
      expect(console.log).toHaveBeenCalledWith(`Tag with ID 2 added to Capsule with ID 1`);
    });

    it('should log a warning if no tags are provided', () => {
      spyOn(console, 'warn'); // Spy on console.warn

      service.addTagsToCapsule(1, []);

      expect(console.warn).toHaveBeenCalledWith('No tags to add.');
    });
  });
});
