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
    const apiUrl = 'http://localhost:5062/api/capsules';

    this.http.post<any>(apiUrl, this.capsule).subscribe({
      next: (response) => {
        console.log('Capsule created successfully:', response);

        if (response.capsuleID) {
          this.addTagsToCapsule(response.capsuleID);
          alert('Capsule created successfully!');
          this.resetForm();
        } else {
          console.error('CapsuleID is missing in the response.');
          alert('Failed to retrieve Capsule ID from the server.');
        }
      },
      error: (error) => {
        console.error('Error creating capsule:', error);

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


