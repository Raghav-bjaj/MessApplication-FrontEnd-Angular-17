// src/app/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {

    return this.authService.isLoggedIn$.pipe(
      take(1), // Take the first emitted value and complete
      map((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          return true; // User is logged in, allow access
        } else {
          // User is not logged in, redirect to login page
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}
