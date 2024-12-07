import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-capsule',
  standalone: true,
  templateUrl: './create-capsule.component.html',
  styleUrls: ['./create-capsule.component.css'],
  imports: [FormsModule, CommonModule], // Ensure FormsModule is imported
})
export class CreateCapsuleComponent {
  capsule = {
    text: '',
    date: '',
    receiver: '',
  };

  onSubmit() {
    console.log('Capsule submitted:', this.capsule);
    alert('Your capsule has been created!');
    // Reset the form
    this.capsule = { text: '', date: '', receiver: '' };
  }

  goBack() {
    console.log('Go back button clicked'); // Placeholder until routing is implemented
  }
}
