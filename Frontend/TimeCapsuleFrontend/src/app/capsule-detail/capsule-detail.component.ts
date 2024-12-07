import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapsuleService, Capsule } from '../capsule.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-capsule-detail',
  standalone: true,
  templateUrl: './capsule-detail.component.html',
  styleUrls: ['./capsule-detail.component.css'],
  imports: [CommonModule],
})
export class CapsuleDetailComponent implements OnInit {
  capsule: Capsule | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private capsuleService: CapsuleService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.fetchCapsule(id);
    }
  }

  fetchCapsule(id: number) {
    this.capsuleService.getCapsuleById(id).subscribe({
      next: (data) => {
        this.capsule = data;
      },
      error: (err) => {
        console.error('Error fetching capsule:', err);
        this.error = 'Failed to load capsule.';
      },
    });
  }

  goBack() {
    this.router.navigate(['/view-capsules']);
  }
}
