// src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject holds the current login status, emits to subscribers
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  // Expose login status as an Observable
  isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  // Define your hardcoded password (for demo purposes ONLY)
  private readonly HARDCODED_PASSWORD = 'Jaat'; // <<< CHANGE THIS PASSWORD!

  constructor(private router: Router) { }

  // Check if a login token exists in localStorage on service initialization
  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Login method: checks password, sets token, updates state
  login(password: string): Observable<boolean> {
    // Simulate API call delay (optional)
    return of(password === this.HARDCODED_PASSWORD).pipe(
      delay(500), // Simulate network delay
      tap(success => {
        if (success) {
          // If password matches, set a dummy token and update state
          localStorage.setItem('auth_token', 'some_dummy_jwt_token_for_basic_auth');
          this.loggedIn.next(true); // Emit true to all subscribers
          this.router.navigate(['/getStudents']); // Navigate to protected page
        } else {
          this.loggedIn.next(false); // Emit false
        }
      })
    );
  }

  // Logout method: clears token, updates state, redirects to login
  logout(): void {
    localStorage.removeItem('auth_token');
    this.loggedIn.next(false); // Emit false to all subscribers
    this.router.navigate(['/login']); // Redirect to login page
  }
}
