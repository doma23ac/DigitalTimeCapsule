import { Component, OnInit } from '@angular/core';
import { CapsuleService, Capsule } from '../capsule.service';
import { CommonModule } from '@angular/common';
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

  constructor(private capsuleService: CapsuleService) {}

  ngOnInit() {
    this.fetchCapsules();
  }

  fetchCapsules() {
    this.capsuleService.getAllCapsules().subscribe({
      next: (data) => {
        this.capsules = data;
      },
      error: (err) => {
        console.error('Error fetching capsules:', err);
        this.error = 'Failed to load capsules.';
      },
    });
  }

  viewCapsule(capsule: Capsule) {
    console.log(`Viewing capsule with ID: ${capsule.capsuleID}`);
    // Example: Navigate to detail view
  }

  get unopenedCapsules(): number {
    return this.capsules.filter((capsule) => capsule.status !== 'opened').length;
  }
}


