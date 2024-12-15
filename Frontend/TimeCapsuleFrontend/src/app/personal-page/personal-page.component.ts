import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-page',
  standalone: true,
  imports: [CommonModule, MatIconModule], // Include MatIconModule and CommonModule here
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css']
})
export class PersonalPageComponent implements OnInit {
  user: any;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }

  logout(): void {
    this.userService.clearUser();
    this.router.navigate(['/']); // Redirect to home
  }

  createNewCapsule(): void {
    this.router.navigate(['/create-capsule']); // Navigate to create capsule page
  }

  viewCapsules(): void {
    this.router.navigate(['/view-capsules']); // Navigate to view capsules page
  }

  goToProfile(): void {
    this.router.navigate(['/profile']); // Navigate to the profile page
  }
}
