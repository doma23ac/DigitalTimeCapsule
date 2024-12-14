import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // For routing

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],  // Just include RouterModule for routing
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
