
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { guestInterceptor } from './guest.interceptor'; // <-- Import the new interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Provide HttpClient with the fetch API and our new interceptor
    provideHttpClient(
      withFetch(),
      withInterceptors([guestInterceptor]) // <-- Register the interceptor here
    ),
    provideAnimationsAsync()
  ]
};

