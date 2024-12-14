


import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // For routing
import { MaterialModule } from './shared/MaterialModule';  // Import Material module

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MaterialModule],  // Import MaterialModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isMuted: boolean = true; // Track whether the video is muted or not

  // Toggle sound on the YouTube video background
  toggleSound(): void {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      const src = iframe.getAttribute('src');
      if (this.isMuted) {
        // Unmute the video by changing the URL to mute=0
        iframe.setAttribute('src', src?.replace('mute=1', 'mute=0') || '');
      } else {
        // Mute the video by changing the URL to mute=1
        iframe.setAttribute('src', src?.replace('mute=0', 'mute=1') || '');
      }
      this.isMuted = !this.isMuted; // Toggle the mute state
    }
  }
}
