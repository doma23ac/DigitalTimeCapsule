import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for API calls
import { Router } from '@angular/router';
import { UserService } from '../user.service'; // Import UserService

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule], // Include CommonModule and FormsModule
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = { username: '', email: '' }; // User details
  password: string = ''; // New password field
  private apiUrl = 'http://localhost:5062/api/Users'; // API endpoint

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const loggedInUser = this.userService.getUser();

    if (!loggedInUser) {
      alert('No user is logged in. Redirecting to login.');
      this.router.navigate(['/login']);
      return;
    }

    this.user.username = loggedInUser.username;
    this.user.email = loggedInUser.email;
    this.user.userId = loggedInUser.userId; // Store the user ID for updates
  }

  onUpdate(): void {
    const updatePayload = {
      userId: this.user.userId, // Ensure the correct user ID is sent
      username: this.user.username, // Username may remain unchanged
      email: this.user.email,
      password: this.password, // Send new password if provided
    };

    this.http.put(`${this.apiUrl}/${this.user.userId}`, updatePayload).subscribe({
      next: () => {
        alert('Your profile has been updated successfully.');
        // Optionally, update the local storage with the new email
        this.userService.setUser({
          userId: this.user.userId,
          username: this.user.username,
          email: this.user.email,
        });
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        alert('Failed to update profile. Please try again.');
      },
    });
  }
}

