import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loginData = { email: '', password: '' };
  errorMessage: string | null = null;

  constructor(private router: Router, private http: HttpClient, private userService: UserService) {}

  onLogin(): void {
    const basicAuthHeader = 'Basic ' + btoa(`${this.loginData.email}:${this.loginData.password}`);
    const apiUrl = 'http://localhost:5062/api/login';
    const headers = new HttpHeaders().set('Authorization', basicAuthHeader);
  
    // Store the header in local storage
    localStorage.setItem('authHeader', basicAuthHeader);
  
    this.http.post<any>(apiUrl, {}, { headers }).subscribe({
      next: (response) => {
        if (response.message === 'Login successful') {
          this.userService.setUser(response);
          // Store the user information in local storage
          localStorage.setItem('user', JSON.stringify(response));
          console.log('Stored user in localStorage:', localStorage.getItem('user')); // Print the stored user
          this.router.navigate(['/personal']);
        } else {
          this.errorMessage = 'Unexpected response';
        }
      },
      error: (error) => {
        this.errorMessage = 'Login failed';
      }
    });
  }

  isLandingPage(): boolean {
    return location.pathname === '/';
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
}

