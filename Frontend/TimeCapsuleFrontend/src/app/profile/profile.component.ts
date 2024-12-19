import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

// Import Material modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule, // Import MatFormFieldModule
    MatInputModule,     // Import MatInputModule
    MatButtonModule     // Import MatButtonModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = { username: '', email: '' };
  password: string = '';
  private apiUrl = 'http://localhost:5062/api/Users';
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const loggedInUser = this.userService.getUser();

    if (!loggedInUser) {
      this.errorMessage = 'No user is logged in. Redirecting to login.';
      this.router.navigate(['/login']);
      return;
    }

    this.user.username = loggedInUser.username;
    this.user.email = loggedInUser.email;
    this.user.userId = loggedInUser.userId;
  }

  onUpdate(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (!this.validateEmail(this.user.email)) {
      this.errorMessage = 'Invalid email address.';
      return;
    }

    if (this.password && !this.validatePassword(this.password)) {
      this.errorMessage =
        'Password must contain at least one uppercase letter, one special character, and be 6-12 characters long.';
      return;
    }

    const updatePayload = {
      userId: this.user.userId,
      username: this.user.username,
      email: this.user.email,
      password: this.password || undefined
    };

    this.http.put(`${this.apiUrl}/${this.user.userId}`, updatePayload).subscribe({
      next: () => {
        this.successMessage = 'Your profile has been updated successfully.';
        this.userService.setUser({
          userId: this.user.userId,
          username: this.user.username,
          email: this.user.email
        });
      },
      error: () => {
        this.errorMessage = 'Failed to update profile. Please try again.';
      }
    });
  }

  onDelete(): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete your account? This will permanently delete all your capsules.'
    );

    if (confirmDelete) {
      this.http.delete(`${this.apiUrl}/${this.user.userId}`).subscribe({
        next: () => {
          this.successMessage = 'Your account has been deleted.';
          this.userService.clearUser();
          this.router.navigate(['/login']);
        },
        error: () => {
          this.errorMessage = 'Failed to delete your account. Please try again.';
        }
      });
    }
  }

  navigateToPersonalPage(): void {
    this.router.navigate(['/personal']);
  }

  validateEmail(email: string): boolean {
    return email.includes('@');
  }

  validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;
    return passwordRegex.test(password);
  }
}
