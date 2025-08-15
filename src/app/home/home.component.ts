import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card'; // Import the card module
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatIconModule], // Add the card module to the imports array
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}