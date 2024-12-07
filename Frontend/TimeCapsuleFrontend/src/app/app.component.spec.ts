import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="landing-page">
      <h1>{{ title }}</h1>
      <form (ngSubmit)="onLogin()">
        <label for="email">Email:</label>
        <input type="email" id="email" [(ngModel)]="loginData.email" name="email" required>

        <label for="password">Password:</label>
        <input type="password" id="password" [(ngModel)]="loginData.password" name="password" required>

        <button type="submit">Login</button>
      </form>

      <button class="signup-button" (click)="navigateToSignup()">Sign Up</button>

      <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  `,
  styles: [`
    .landing-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      background-color: #f3f4f6;
      color: #333;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1em;
      width: 300px;
      margin: 0 auto;
    }

    input {
      padding: 0.5em;
      font-size: 1rem;
    }

    button {
      padding: 0.5em;
      font-size: 1rem;
      background-color: #007bff;
      color: #fff;
      border: none;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }

    .signup-button {
      margin-top: 1em;
      background-color: #28a745;
    }

    .signup-button:hover {
      background-color: #218838;
    }

    .error {
      color: red;
      text-align: center;
    }
  `]
})
export class AppComponent {
  title = 'Welcome to TimeCapsuleFrontend'; // Updated title
  loginData = { email: '', password: '' };
  errorMessage: string | null = null;

  constructor(private router: Router) {}

  onLogin() {
    const apiUrl = 'http://localhost:3000/login'; // Replace with your backend URL
    // Mock login for demonstration
    if (this.loginData.email === 'test@example.com' && this.loginData.password === 'password123') {
      console.log('Login successful!');
      alert('Login successful!');
      this.errorMessage = null;
    } else {
      this.errorMessage = 'Invalid email or password';
    }
  }

  navigateToSignup() {
    this.router.navigate(['/signup']); // Navigates to the signup page
  }
}

