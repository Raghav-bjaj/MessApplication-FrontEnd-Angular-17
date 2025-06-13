import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation-bar/navigation-bar.component';
import { HttpClientModule } from '@angular/common/http';

console.log("At the start of APP.Component")

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, HttpClientModule],
  template: `
    <div class="app-container">
      <app-navigation></app-navigation>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      font-family: Arial, sans-serif;
    }
  `]
})
export class AppComponent {
  title = 'MessFrontGPT';
}


console.log("At the end of APP.Component")