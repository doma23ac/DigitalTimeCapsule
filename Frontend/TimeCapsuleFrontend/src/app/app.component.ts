import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, FormsModule],  // Import RouterModule in standalone component
  template: `
    <div class="landing-page" *ngIf="isLandingPage(); else routedContent">
      <h1>Welcome to My Landing Page</h1>
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

    <ng-template #routedContent>
      <router-outlet></router-outlet>
    </ng-template>
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
  loginData = { email: '', password: '' };
  errorMessage: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  onLogin() {
    const email = this.loginData.email;
    const password = this.loginData.password;

    const basicAuthHeader = 'Basic ' + btoa(`${email}:${password}`);
    const apiUrl = 'http://localhost:5062/api/login';  // Backend API URL
    const headers = new HttpHeaders().set('Authorization', basicAuthHeader);

    // No need for 'responseType: text', default responseType is JSON
    this.http.post<any>(apiUrl, {}, { headers }).subscribe({
      next: (response) => {
        console.log('Login successful! Response:', response);  // Log the JSON response

        // Check for the 'message' in the JSON response
        if (response && response.message === 'Login successful') {
          console.log('Redirecting to /personal');
          this.router.navigate(['/personal']);  // Redirect to personal page on successful login
        } else {
          this.errorMessage = 'Unexpected response: ' + (response?.message || 'Unknown error');
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        this.errorMessage = 'Invalid email or password';  // Handle error
      }
    });
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  isLandingPage(): boolean {
    return location.pathname === '/';
  }
}
