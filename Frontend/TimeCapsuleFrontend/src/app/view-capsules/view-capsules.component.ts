import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

export interface Capsule {
  capsuleID: number;
  title: string;
  message: string;
  lockDate: string;
  status: string;
  senderID: number;
  recipientID: number | null;
  senderUsername?: string;
  recipientUsername?: string;
  tags?: Tag[];
}

export interface Tag {
  tagID: number;
  tagName: string;
}

@Component({
  selector: 'app-view-capsules',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './view-capsules.component.html',
  styleUrls: ['./view-capsules.component.css'],
})
export class ViewCapsulesComponent implements OnInit {
  capsules: Capsule[] = [];
  error: string | null = null;
  userID: number | null = null;
  expandedCapsuleID: number | null = null;

  private apiUrl = 'http://localhost:5062/api/capsules'; // Replace with your actual endpoint

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit() {
    const user = this.userService.getUser();
    if (user && user.userId) {
      this.userID = user.userId;
      this.fetchCapsules();
    } else {
      this.error = 'User not logged in.';
    }
  }

  fetchCapsules() {
    this.http.get<Capsule[]>(this.apiUrl).subscribe({
      next: (data) => {
        const today = new Date();
        this.capsules = data.filter(
          (capsule) =>
            capsule.recipientID === this.userID &&
            new Date(capsule.lockDate) <= today
        );
        this.capsules.forEach((capsule) => this.fetchTagsForCapsule(capsule));
      },
      error: (err) => {
        console.error('Error fetching capsules:', err);
        this.error = 'Failed to load capsules.';
      },
    });
  }

  fetchTagsForCapsule(capsule: Capsule) {
    const tagsApiUrl = `http://localhost:5062/api/capsuletags/${capsule.capsuleID}`;
    this.http.get<Tag[]>(tagsApiUrl).subscribe({
      next: (tags) => (capsule.tags = tags),
      error: (err) => {
        console.error(`Error fetching tags for capsule ${capsule.capsuleID}:`, err);
        capsule.tags = [];
      },
    });
  }

  // Add the toggleCapsuleMessage method here
  toggleCapsuleMessage(capsuleID: number) {
    // Toggle the expanded state of the capsule
    this.expandedCapsuleID = this.expandedCapsuleID === capsuleID ? null : capsuleID;
  }

  deleteCapsule(capsuleID: number) {
    const confirmDelete = confirm(
      'Are you sure you want to delete this capsule? This action cannot be undone.'
    );

    if (confirmDelete) {
      this.http.delete(`${this.apiUrl}/${capsuleID}`).subscribe({
        next: () => {
          alert('Capsule deleted successfully.');
          this.capsules = this.capsules.filter((capsule) => capsule.capsuleID !== capsuleID);
        },
        error: (err) => {
          console.error('Error deleting capsule:', err);
          alert('Failed to delete the capsule. Please try again.');
        },
      });
    }
  }
}
