import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-personal-page',
  standalone: true,
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class PersonalPageComponent {
  createNewCapsule() {
    // Logic to create a new capsule
    console.log('Create a new capsule button clicked');
  }

  viewCapsules() {
    // Logic to view available capsules
    console.log('View available capsules button clicked');
  }
}
