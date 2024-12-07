import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: any;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, SignupComponent], // Use HttpClientTestingModule for mocking HTTP
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent); // Create the component
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController); // Inject the HTTP testing controller
    fixture.detectChanges(); // Trigger change detection
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure no pending HTTP requests
  });

  it('should create the SignupComponent', () => {
    expect(component).toBeTruthy(); // Ensure the component initializes properly
  });

  it('should render form inputs and button', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // Check if all input fields exist
    expect(compiled.querySelector('input#name')).toBeTruthy();
    expect(compiled.querySelector('input#age')).toBeTruthy();
    expect(compiled.querySelector('input#email')).toBeTruthy();
    expect(compiled.querySelector('input#password')).toBeTruthy();

    // Check if the submit button exists
    expect(compiled.querySelector('button[type="submit"]')?.textContent).toContain('Sign Up');
  });

  it('should send a POST request on form submission and handle success', () => {
    // Set mock signup data
    component.signupData = { name: 'John', age: 30, email: 'john@example.com', password: 'password123' };

    // Call the method to simulate form submission
    component.onSignup();

    // Mock the expected HTTP POST request
    const req = httpTestingController.expectOne('http://localhost:3000/signup');
    expect(req.request.method).toBe('POST'); // Ensure it's a POST request
    expect(req.request.body).toEqual(component.signupData); // Ensure the correct data is sent

    // Mock a successful response
    req.flush({ message: 'Signup successful' });

    // Check if successMessage is set correctly
    expect(component.successMessage).toBe('Signup successful! Please log in.');
    expect(component.errorMessage).toBeNull();
  });

  it('should handle signup failure', () => {
    // Set mock signup data
    component.signupData = { name: 'John', age: 30, email: 'john@example.com', password: 'password123' };

    // Call the method to simulate form submission
    component.onSignup();

    // Mock the expected HTTP POST request and return an error
    const req = httpTestingController.expectOne('http://localhost:3000/signup');
    req.flush({ message: 'Signup failed' }, { status: 400, statusText: 'Bad Request' });

    // Check if errorMessage is set correctly
    expect(component.successMessage).toBeNull();
    expect(component.errorMessage).toBe('Signup failed. Please try again.');
  });
});


