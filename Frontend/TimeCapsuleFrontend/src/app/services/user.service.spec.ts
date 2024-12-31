import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockBaseUrl = 'http://localhost:5062/api';
  const mockCredentials = 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateUser', () => {
    it('should send a POST request with basic auth headers to validate user login', () => {
      const mockUsername = 'test@example.com';
      const mockPassword = 'password123';
      const mockResponse = { message: 'Login successful' };

      service.validateUser(mockUsername, mockPassword).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(
        `Basic ${btoa(`${mockUsername}:${mockPassword}`)}`
      );
      req.flush(mockResponse);
    });

    it('should handle errors gracefully when login fails', () => {
      const mockUsername = 'wrong@example.com';
      const mockPassword = 'wrongpassword';
      const mockErrorMessage = 'Unauthorized';

      service.validateUser(mockUsername, mockPassword).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.statusText).toBe(mockErrorMessage);
        },
      });

      const req = httpMock.expectOne(`${mockBaseUrl}/login`);
      req.flush(null, { status: 401, statusText: mockErrorMessage });
    });
  });
});
