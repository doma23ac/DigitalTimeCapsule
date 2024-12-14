import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngIf and other directives
import { FormsModule } from '@angular/forms'; // For ngModel
import { HttpClient } from '@angular/common/http'; // For HttpClient

import { MatInputModule } from '@angular/material/input'; // For matInput
import { MatButtonModule } from '@angular/material/button'; // For mat-raised-button

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],  // Importing necessary Material modules
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupData = { username: '', email: '', password: '' };
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  onSignup() {
    const apiUrl = 'http://localhost:5062/api/signup'; // Replace with your backend URL
    this.http.post(apiUrl, this.signupData).subscribe({
      next: (response: any) => {
        console.log('Signup successful:', response);
        this.successMessage = 'Signup successful! Please log in.';
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Signup failed:', error);
        this.successMessage = null;
        this.errorMessage = 'Signup failed. Please try again.';
      }
    });
  }
}
