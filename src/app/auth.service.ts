import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';

// Define the possible user roles
export type UserRole = 'admin' | 'student' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubjects to hold the current login state, user role, and registration number
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userRole = new BehaviorSubject<UserRole>(null);
  private currentUserRegNo = new BehaviorSubject<string | null>(null);

  // Public observables that components can subscribe to
  public isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();
  public userRole$: Observable<UserRole> = this.userRole.asObservable();
  public currentUserRegNo$: Observable<string | null> = this.currentUserRegNo.asObservable();

  // Convenience observable to easily check if the user is an admin
  public isAdmin$: Observable<boolean> = this.userRole$.pipe(
    map(role => role === 'admin')
  );

  // --- Hardcoded credentials for demonstration ---
  // Admin: 5-digit number
  private readonly ADMIN_USERNAME = '12345';
  private readonly ADMIN_PASSWORD = 'AdminPassword123';
  // Student: Alphanumeric string
  private readonly STUDENT_USERNAME = '22BAI10072';
  private readonly STUDENT_PASSWORD = 'StudentPassword123';
  // -----------------------------------------

  private readonly isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    // When the service initializes, check for all stored session info
    if (this.isBrowser) {
      this.loggedIn.next(this.hasToken());
      this.userRole.next(this.getRoleFromStorage());
      this.currentUserRegNo.next(this.getRegNoFromStorage());
    }
  }

  private hasToken(): boolean {
    if (this.isBrowser) {
      return !!localStorage.getItem('auth_token');
    }
    return false;
  }

  private getRoleFromStorage(): UserRole {
    if (this.isBrowser) {
      return localStorage.getItem('user_role') as UserRole;
    }
    return null;
  }
  
  private getRegNoFromStorage(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('user_reg_no');
    }
    return null;
  }

  // Updated login method to handle username and password
  public login(username: string, password: string): Observable<boolean> {
    let role: UserRole = null;
    let regNo: string | null = null;
    let loginSuccess = false;

    // Check if it's an admin login
    if (username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD) {
      role = 'admin';
      loginSuccess = true;
    } 
    // Check if it's a student login
    else if (username === this.STUDENT_USERNAME && password === this.STUDENT_PASSWORD) {
      role = 'student';
      regNo = username; // The student's username is their registration number
      loginSuccess = true;
    }

    return of(loginSuccess).pipe(
      delay(500),
      tap(success => {
        if (success && this.isBrowser && role) {
          // Store all relevant info in localStorage
          localStorage.setItem('auth_token', 'dummy_token_for_' + role);
          localStorage.setItem('user_role', role);
          if (regNo) {
            localStorage.setItem('user_reg_no', regNo);
          }
          // Update the observables
          this.loggedIn.next(true);
          this.userRole.next(role);
          this.currentUserRegNo.next(regNo);
          this.router.navigate(['/home']);
        } else {
          this.logout(); // Clear any partial state on failure
        }
      })
    );
  }

  // Updated logout to clear all session information
  public logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_reg_no');
      this.loggedIn.next(false);
      this.userRole.next(null);
      this.currentUserRegNo.next(null);
      this.router.navigate(['/login']);
    }
  }
}