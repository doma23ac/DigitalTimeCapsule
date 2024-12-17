import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router'; // Import Router

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
    MatCheckboxModule,
  ],
  templateUrl: './view-capsules.component.html',
  styleUrls: ['./view-capsules.component.css'],
})
export class ViewCapsulesComponent implements OnInit {
  capsules: Capsule[] = [];
  filteredCapsules: Capsule[] = [];
  error: string | null = null;
  userID: number | null = null;
  expandedCapsuleID: number | null = null;
  lockedCapsulesCount: number = 0;


  availableTags: Tag[] = [];
  selectedTags: number[] = [];

  private apiUrl = 'http://localhost:5062/api/capsules';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router // Inject Router
  ) {}

  ngOnInit() {
    const user = this.userService.getUser();
    if (user && user.userId) {
      this.userID = user.userId;
      this.fetchCapsules(); // Lädt die offenen Kapseln
      this.fetchLockedCapsules(); // Lädt die geschlossenen Kapseln (nur Zählung)
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
            capsule.recipientID === this.userID && // Only for the logged-in user
            new Date(capsule.lockDate) <= today // Lock date must not be in the future
        );
        this.filteredCapsules = [...this.capsules]; // Initially, no additional filters applied
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

  onTagCheckboxChange(tagID: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement; // Cast event.target to HTMLInputElement
    if (checkbox.checked) {
      this.selectedTags.push(tagID);
    } else {
      this.selectedTags = this.selectedTags.filter((id) => id !== tagID);
    }
    this.filterCapsules();
  }
  

  filterCapsules() {
    if (this.selectedTags.length === 0) {
      // Reset to all capsules ready to open for the logged-in user
      this.filteredCapsules = [...this.capsules];
    } else {
      // Apply tag filtering
      this.filteredCapsules = this.capsules.filter((capsule) =>
        capsule.tags?.some((tag) => this.selectedTags.includes(tag.tagID)) // Only capsules matching selected tags
      );
    }
  }
  fetchLockedCapsules() {
    this.http.get<Capsule[]>(this.apiUrl).subscribe({
      next: (data) => {
        const today = new Date();
  
        // Nur die geschlossenen Kapseln für den eingeloggten Benutzer zählen
        this.lockedCapsulesCount = data.filter(
          (capsule) =>
            capsule.recipientID === this.userID && // Für den eingeloggten Benutzer
            new Date(capsule.lockDate) > today // Lockdatum in der Zukunft
        ).length;
      },
      error: (err) => {
        console.error('Error fetching locked capsules:', err);
      },
    });
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
      this.http.delete(`${this.apiUrl}/${capsuleID}`).subscribe({
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
    this.router.navigate(['/personal']); // Route to '/personal'
  }
  getLockedCapsulesCount(): number {
    const today = new Date();
    return this.capsules.filter((capsule) => new Date(capsule.lockDate) > today).length;
  }
  
}
