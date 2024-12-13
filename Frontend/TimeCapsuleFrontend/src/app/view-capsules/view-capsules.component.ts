import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

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
}

@Component({
  selector: 'app-view-capsules',
  standalone: true,
  templateUrl: './view-capsules.component.html',
  styleUrls: ['./view-capsules.component.css'],
  imports: [CommonModule],
})
export class ViewCapsulesComponent implements OnInit {
  capsules: Capsule[] = [];
  error: string | null = null;
  userID: number | null = null;
  expandedCapsuleID: number | null = null; // To track expanded capsule

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
    const apiUrl = 'http://localhost:5062/api/capsules'; // Replace with your actual endpoint
    this.http.get<Capsule[]>(apiUrl).subscribe({
      next: (data) => {
        const today = new Date();
        // Filter capsules where RecipientID matches and LockDate is today or earlier
        this.capsules = data.filter(
          (capsule) =>
            capsule.recipientID === this.userID &&
            new Date(capsule.lockDate) <= today &&
            capsule.status !== 'opened'
        );
      },
      error: (err) => {
        console.error('Error fetching capsules:', err);
        this.error = 'Failed to load capsules.';
      },
    });
  }

  toggleCapsuleMessage(capsuleID: number) {
    // Toggle the expanded state
    this.expandedCapsuleID = this.expandedCapsuleID === capsuleID ? null : capsuleID;
  }

  markCapsuleAsOpened(capsule: Capsule) {
    capsule.status = 'opened';
    this.expandedCapsuleID = null; // Collapse after marking as opened
  }
}



