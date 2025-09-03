import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userRole$.pipe(
    take(1),
    map(role => {
      // --- THIS IS THE FIX ---
      // We now allow access if the user is an admin, a student, OR a guest.
      // This allows recruiters to view the live feature pages.
      if (role === 'admin' || role === 'student' || role === 'guest') {
        return true;
      }

      // If for some reason there is no role, redirect to the login page.
      return router.createUrlTree(['/login']);
    })
  );
};

