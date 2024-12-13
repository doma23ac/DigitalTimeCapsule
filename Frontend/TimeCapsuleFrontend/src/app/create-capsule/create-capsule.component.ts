import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-create-capsule',
  standalone: true,
  templateUrl: './create-capsule.component.html',
  styleUrls: ['./create-capsule.component.css'],
  imports: [FormsModule, CommonModule],
})
export class CreateCapsuleComponent implements OnInit {
  capsule = {
    title: '',
    message: '',
    lockDate: '',
    status: 'Open', // Default status
    senderUsername: '',
    recipientUsername: ''
  };
  userName: string | null = null;

  constructor(
    private http: HttpClient,
    private location: Location,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Retrieve the currently logged-in user from the UserService
    const user = this.userService.getUser();
    if (user && user.username) {
      this.userName = user.username; // Set the user's name
      this.capsule.senderUsername = user.username; // Set the sender username
    } else {
      console.warn('User is not logged in or username is missing.');
    }
  }

  onSubmit(): void {
    const apiUrl = 'http://localhost:5062/api/capsules';
  
    // Log the capsule data for debugging
    console.log('Submitting capsule:', this.capsule);
  
    this.http.post<any>(apiUrl, this.capsule).subscribe({
      next: (response) => {
        console.log('Capsule created successfully:', response);
        alert('Capsule created successfully!');
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating capsule:', error);
  
        // Handle specific backend error messages
        if (error.status === 400) {
          alert('Invalid capsule data. Please check all fields and try again.');
        } else if (error.status === 404) {
          alert('User not found. Please check the sender or recipient username.');
        } else {
          alert('Failed to create capsule. Please try again later.');
        }
      },
    });
  }
  

  goBack(): void {
    this.location.back();
  }

  // Reset the form fields
  resetForm(): void {
    this.capsule = {
      title: '',
      message: '',
      lockDate: '',
      status: 'Open',
      senderUsername: this.userName || '', // Keep the senderUsername intact
      recipientUsername: ''
    };
  }
}

