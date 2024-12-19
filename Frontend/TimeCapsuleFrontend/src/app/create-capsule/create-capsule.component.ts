import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CapsuleService, Tag } from '../services/capsule.service';
import { UserService } from '../services/user.service';

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
  minDate: string = ''; // For restricting date selection to future dates

  constructor(
    private capsuleService: CapsuleService,
    private userService: UserService,
    private location: Location
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
    this.setMinDate(); // Set the minimum selectable date
  }

  setMinDate(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Format date as yyyy-MM-dd
  }

  fetchAvailableTags(): void {
    this.capsuleService.getTags().subscribe({
      next: (tags) => {
        this.availableTags = tags;
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
    if (!this.validateFields()) return;

    this.capsuleService.createCapsule(this.capsule).subscribe({
      next: (response) => {
        if (response.capsuleID) {
          this.addTagsToCapsule(response.capsuleID);
          this.successMessage = 'Capsule created successfully!';
          this.errorMessage = null;
          this.resetForm();
        } else {
          this.errorMessage = 'Failed to create capsule.';
          this.successMessage = null;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to create capsule. Please try again.';
        this.successMessage = null;
      },
    });
  }

  addTagsToCapsule(capsuleID: number): void {
    if (this.selectedTagIDs.length === 0) {
      console.log('No tags selected to add.');
      return; // No tags to add
    }
  
    console.log('Sending tags to be added:', { capsuleID, tags: this.selectedTagIDs });
  
    this.capsuleService.addTagsToCapsule(capsuleID, this.selectedTagIDs);
  }
  
  
  

  
  

  validateFields(): boolean {
    const { title, message, lockDate, recipientUsername } = this.capsule;

    if (!title || !message || !lockDate || !recipientUsername) {
      this.errorMessage = 'Fill out all fields.';
      this.successMessage = null;
      return false;
    }

    this.errorMessage = null;
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
