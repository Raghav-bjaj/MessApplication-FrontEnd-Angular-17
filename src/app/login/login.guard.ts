import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { map, take } from 'rxjs/operators';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userRole$.pipe(
    take(1),
    map(role => {
      // If the user has any role (is logged in)
      if (role) {
        // Redirect guests to the features page
        if (role === 'guest') {
          return router.createUrlTree(['/features']);
        }
        // Redirect admins and students to the home page
        return router.createUrlTree(['/home']);
      }
      // If the user is not logged in (role is null), allow access to the login page
      return true;
    })
  );
};