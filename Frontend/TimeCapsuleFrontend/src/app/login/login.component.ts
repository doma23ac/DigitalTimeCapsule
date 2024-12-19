import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service'; // Import UserService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private userService: UserService // Use UserService for auth handling
  ) {}

  onLogin(): void {
    this.userService.validateUser(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        if (response.message === 'Login successful') {
          // Set credentials and user data using UserService
          this.userService.setCredentials(this.loginData.email, this.loginData.password);
          this.userService.setUser(response);

          // Navigate to the personal page
          this.router.navigate(['/personal']);
        } else {
          this.errorMessage = 'Unexpected response from the server.';
        }
      },
      error: () => {
        this.errorMessage = 'Email address or password is wrong. Try again.';
      }
    });
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
}



