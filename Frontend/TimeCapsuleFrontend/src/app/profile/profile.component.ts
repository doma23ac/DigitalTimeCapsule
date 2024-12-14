import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule], // Include FormsModule here
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: any = { email: '' }; // Ensure user object has an initial structure
  password: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Simulate user data fetching
    this.user = { email: 'example@example.com' };
  }

  onUpdate(): void {
    console.log('Updated user email:', this.user.email);
    console.log('Updated password:', this.password);
    // Add API call logic here to update user details
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete your account?')) {
      console.log('User account deleted');
      // Add API call logic here to delete user account
      this.router.navigate(['/login']); // Redirect to login after deletion
    }
  }
}
