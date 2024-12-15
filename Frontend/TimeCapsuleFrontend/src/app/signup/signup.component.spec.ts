import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; // For input fields
import { MatButtonModule } from '@angular/material/button'; // For buttons
import { FormsModule } from '@angular/forms'; // For ngModel
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, FormsModule], // Include Material modules here
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupData = { username: '', email: '', password: '' };
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  validateEmail(email: string): boolean {
    // Check if email contains "@" symbol
    return email.includes('@');
  }

  validatePassword(password: string): boolean {
    // Password should have one uppercase letter, one number, one special character, and length 6-12
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;
    return passwordRegex.test(password);
  }

  onSignup(): void {
    // Clear any previous messages
    this.successMessage = null;
    this.errorMessage = null;

    // Validate email
    if (!this.validateEmail(this.signupData.email)) {
      this.errorMessage = 'Invalid email';
      return;
    }

    // Validate password
    if (!this.validatePassword(this.signupData.password)) {
      this.errorMessage = 'Password must have one uppercase letter, one number, one special character, and be 6-12 characters long.';
      return;
    }

    const apiUrl = 'http://localhost:5062/api/signup';

    this.http.post<any>(apiUrl, this.signupData).subscribe({
      next: (response) => {
        if (response.message === 'Signup successful') {
          this.successMessage = 'Signup successful! Please log in.';
          setTimeout(() => this.router.navigate(['/login']), 3000); // Redirect to login after 3 seconds
        } else {
          this.errorMessage = 'Unexpected response';
        }
      },
      error: (err) => {
        if (err.error && err.error.message === 'User already exists') {
          this.errorMessage = 'User already exists.';
        } else {
          this.errorMessage = 'Signup failed. Please try again.';
        }
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}



