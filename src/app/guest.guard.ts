
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userRole$.pipe(
    take(1),
    map(role => {
      // If the user is a guest, allow access
      if (role === 'guest') {
        return true;
      }
      
      // If not a guest, redirect them to their default home page
      router.navigate(['/home']);
      return false;
    })
  );
};