import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupData = { username: '', email: '', password: '' };
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  validateEmail(email: string): boolean {
    // Ensure email contains an '@'
    return email.includes('@');
  }

  validatePassword(password: string): boolean {
    // Password must have at least one uppercase letter and one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;
    return passwordRegex.test(password);
  }

  onSignup(): void {
    // Clear previous messages
    this.successMessage = null;
    this.errorMessage = null;

    // Validate email
    if (!this.validateEmail(this.signupData.email)) {
      this.errorMessage = 'Invalid email.';
      return;
    }

    // Validate password
    if (!this.validatePassword(this.signupData.password)) {
      this.errorMessage =
        'Password must contain at least one uppercase letter, one special character, and be 6-12 characters long.';
      return;
    }

    const apiUrl = 'http://localhost:5062/api/signup';

    this.http.post<any>(apiUrl, this.signupData).subscribe({
      next: (response) => {
        if (response.message === 'Signup successful') {
          this.successMessage = 'Signup successful! Please log in.';
          setTimeout(() => this.router.navigate(['/login']), 3000); // Redirect to login after 3 seconds
        } else {
          this.errorMessage = 'Unexpected response.';
        }
      },
      error: (err) => {
        // Check for specific backend error messages
        if (err.error && err.error.message === 'Email is already in use') {
          this.errorMessage = 'Email is already in use.';
        } else if (err.error && err.error.message === 'Username is already in use') {
          this.errorMessage = 'Username is already in use.';
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
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

