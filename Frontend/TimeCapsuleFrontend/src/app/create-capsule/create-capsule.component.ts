import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserService } from '../user.service';

export interface Tag {
  tagID: number;
  tagName: string;
}

@Component({
  selector: 'app-create-capsule',
  standalone: true,
  templateUrl: './create-capsule.component.html',
  styleUrls: ['./create-capsule.component.css'],
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
})
export class CreateCapsuleComponent implements OnInit {
  capsule = {
    title: '',
    message: '',
    lockDate: '',
    status: 'Open',
    senderUsername: '',
    recipientUsername: ''
  };

  userName: string | null = null;
  availableTags: Tag[] = [];
  selectedTagIDs: number[] = [];
  errorMessage: string | null = null; // For displaying error messages
  successMessage: string | null = null; // For displaying success messages

  constructor(
    private http: HttpClient,
    private location: Location,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const user = this.userService.getUser();
    if (user && user.username) {
      this.userName = user.username;
      this.capsule.senderUsername = user.username;
    } else {
      console.warn('User is not logged in or username is missing.');
    }

    this.fetchAvailableTags();
  }

  fetchAvailableTags(): void {
    const tagsApiUrl = 'http://localhost:5062/api/tags';
    this.http.get<Tag[]>(tagsApiUrl).subscribe({
      next: (data) => {
        this.availableTags = data;
      },
      error: (err) => {
        console.error('Error fetching tags:', err);
      },
    });
  }

  onTagSelection(tagID: number): void {
    if (this.selectedTagIDs.includes(tagID)) {
      this.selectedTagIDs = this.selectedTagIDs.filter((id) => id !== tagID);
    } else {
      this.selectedTagIDs.push(tagID);
    }
  }

  onSubmit(): void {
    // Validate fields before making any API calls
    if (!this.validateFields()) return;
  
     const userCheckApiUrl = `http://localhost:5062/api/users/by-username/${encodeURIComponent(this.capsule.recipientUsername)}`;

  
    // Check if recipient exists
    this.http.get(userCheckApiUrl).subscribe({
      next: (response: any) => {
        console.log('User check response:', response); // Debugging log
  
        // If response is valid, proceed to create the capsule
        if (response && response.username) {
          this.createCapsule();
        } else {
          // Handle unexpected responses gracefully
          this.errorMessage = 'Unexpected response. Please try again.';
          this.successMessage = null; // Clear success message
        }
      },
      error: (error) => {
        console.error('Error during user check:', error); // Debugging log
  
        if (error.status === 400) {
          // Handle specific 400 error
          this.errorMessage = 'Invalid request. Please check the username.';
        } else if (error.status === 404) {
          // Handle 404 (user not found)
          this.errorMessage = 'User does not exist.';
        } else {
          // Handle other errors
          this.errorMessage = 'An error occurred. Please try again later.';
        }
  
        this.successMessage = null; // Clear success message
      },
    });
  }
  
  

  createCapsule(): void {
    const apiUrl = 'http://localhost:5062/api/capsules';

    this.http.post<any>(apiUrl, this.capsule).subscribe({
      next: (response) => {
        if (response.capsuleID) {
          this.addTagsToCapsule(response.capsuleID);
          this.successMessage = 'Capsule created successfully!';
          this.errorMessage = null; // Clear error message
          this.resetForm();
        } else {
          this.errorMessage = 'Failed to create capsule.';
          this.successMessage = null; // Clear success message
        }
      },
      error: () => {
        this.errorMessage = 'Failed to create capsule. Please try again.';
        this.successMessage = null; // Clear success message
      },
    });
  }

  addTagsToCapsule(capsuleID: number): void {
    const capsuleTagsApiUrl = 'http://localhost:5062/api/capsuletags';

    this.selectedTagIDs.forEach((tagID) => {
      this.http.post(`${capsuleTagsApiUrl}/${capsuleID}/${tagID}`, {}).subscribe({
        next: () => {
          console.log(`Tag with ID ${tagID} added to Capsule with ID ${capsuleID}`);
        },
        error: (err) => {
          console.error(`Error adding tag to capsule:`, err);
        },
      });
    });
  }

  validateFields(): boolean {
    const { title, message, lockDate, recipientUsername } = this.capsule;

    if (!title || !message || !lockDate || !recipientUsername) {
      this.errorMessage = 'Fill out all fields.';
      this.successMessage = null; // Clear success message
      return false;
    }

    this.errorMessage = null; // Clear error message if fields are valid
    return true;
  }

  goBack(): void {
    this.location.back();
  }

  resetForm(): void {
    this.capsule = {
      title: '',
      message: '',
      lockDate: '',
      status: 'Open',
      senderUsername: this.userName || '',
      recipientUsername: ''
    };
    this.selectedTagIDs = [];
  }
}

