import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; // For input fields
import { MatButtonModule } from '@angular/material/button'; // For buttons
import { FormsModule } from '@angular/forms';  // For ngModel
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, FormsModule],  // Include Material modules here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  errorMessage: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  onLogin(): void {
    const basicAuthHeader = 'Basic ' + btoa(`${this.loginData.email}:${this.loginData.password}`);
    const apiUrl = 'http://localhost:5062/api/login';
    const headers = new HttpHeaders().set('Authorization', basicAuthHeader);

    // Store the header in local storage
    localStorage.setItem('authHeader', basicAuthHeader);

    this.http.post<any>(apiUrl, {}, { headers }).subscribe({
      next: (response) => {
        if (response.message === 'Login successful') {
          // Store user info and navigate to personal page
          localStorage.setItem('user', JSON.stringify(response));
          this.router.navigate(['/personal']);
        } else {
          this.errorMessage = 'Unexpected response';
        }
      },
      error: () => {
        this.errorMessage = 'Login failed';
      }
    });
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
}



