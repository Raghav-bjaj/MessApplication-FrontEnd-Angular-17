
import { Component, Renderer2, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation-bar/navigation-bar.component';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MessFrontGPT';
  private roleSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object // Inject the platform ID
  ) {}

  ngOnInit(): void {
    // Only run this logic if we are in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.roleSubscription = this.authService.userRole$.subscribe(role => {
        if (role === 'admin') {
          this.renderer.addClass(document.body, 'admin-theme');
        } else {
          this.renderer.removeClass(document.body, 'admin-theme');
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }
}

