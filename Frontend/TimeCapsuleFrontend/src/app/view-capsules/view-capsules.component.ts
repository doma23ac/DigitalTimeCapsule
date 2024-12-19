import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CapsuleService, Capsule, Tag } from '../services/capsule.service';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-view-capsules',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
  ],
  templateUrl: './view-capsules.component.html',
  styleUrls: ['./view-capsules.component.css'],
})
export class ViewCapsulesComponent implements OnInit {
  capsules: Capsule[] = [];
  filteredCapsules: Capsule[] = [];
  availableTags: Tag[] = [];
  selectedTags: number[] = [];
  error: string | null = null;
  userID: number | null = null;
  expandedCapsuleID: number | null = null;
  lockedCapsulesCount: number = 0;

  constructor(
    private capsuleService: CapsuleService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.userService.getUser();
    if (user && user.userId) {
      this.userID = user.userId;
      this.fetchCapsules();
      this.fetchLockedCapsules();
    } else {
      this.error = 'User not logged in.';
    }
  }

  fetchCapsules() {
    this.capsuleService.getCapsules().subscribe({
      next: (capsules) => {
        const today = new Date();
        this.capsules = capsules.filter(
          (capsule) =>
            capsule.recipientID === this.userID &&
            new Date(capsule.lockDate) <= today
        );
        this.filteredCapsules = [...this.capsules];
        this.capsules.forEach((capsule) => this.fetchTagsForCapsule(capsule));
      },
      error: (err) => {
        console.error('Error fetching capsules:', err);
        this.error = 'Failed to load capsules.';
      },
    });
  }

  fetchTagsForCapsule(capsule: Capsule) {
    this.capsuleService.getTagsForCapsule(capsule.capsuleID).subscribe({
      next: (tags) => {
        capsule.tags = tags;
        tags.forEach((tag) => {
          if (!this.availableTags.some((t) => t.tagID === tag.tagID)) {
            this.availableTags.push(tag);
          }
        });
      },
      error: (err) => {
        console.error(`Error fetching tags for capsule ${capsule.capsuleID}:`, err);
        capsule.tags = [];
      },
    });
  }

  fetchLockedCapsules() {
    this.capsuleService.getCapsules().subscribe({
      next: (capsules) => {
        const today = new Date();
        this.lockedCapsulesCount = capsules.filter(
          (capsule) =>
            capsule.recipientID === this.userID &&
            new Date(capsule.lockDate) > today
        ).length;
      },
      error: (err) => {
        console.error('Error fetching locked capsules:', err);
      },
    });
  }

  onTagCheckboxChange(tagID: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedTags.push(tagID);
    } else {
      this.selectedTags = this.selectedTags.filter((id) => id !== tagID);
    }
    this.filterCapsules();
  }

  filterCapsules() {
    if (this.selectedTags.length === 0) {
      this.filteredCapsules = [...this.capsules];
    } else {
      this.filteredCapsules = this.capsules.filter((capsule) =>
        capsule.tags?.some((tag) => this.selectedTags.includes(tag.tagID))
      );
    }
  }

  toggleCapsuleMessage(capsuleID: number) {
    this.expandedCapsuleID =
      this.expandedCapsuleID === capsuleID ? null : capsuleID;
  }

  deleteCapsule(capsuleID: number) {
    const confirmDelete = confirm(
      'Are you sure you want to delete this capsule? This action cannot be undone.'
    );

    if (confirmDelete) {
      this.capsuleService.deleteCapsule(capsuleID).subscribe({
        next: () => {
          alert('Capsule deleted successfully.');
          this.capsules = this.capsules.filter(
            (capsule) => capsule.capsuleID !== capsuleID
          );
          this.filteredCapsules = this.filteredCapsules.filter(
            (capsule) => capsule.capsuleID !== capsuleID
          );
        },
        error: (err) => {
          console.error('Error deleting capsule:', err);
          alert('Failed to delete the capsule. Please try again.');
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/personal']);
  }
}


