
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';

// Define the user session structure
export interface UserSession {
  role: 'admin' | 'student' | 'guest';
  regNo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // A single BehaviorSubject to hold the entire user session
  private session = new BehaviorSubject<UserSession | null>(null);

  // Public observables derived from the session state
  public isLoggedIn$: Observable<boolean> = this.session.pipe(map(s => !!s));
  public userRole$: Observable<UserSession['role'] | null> = this.session.pipe(map(s => s?.role ?? null));
  public currentUserRegNo$: Observable<string | null> = this.session.pipe(map(s => s?.regNo ?? null));
  public isAdmin$: Observable<boolean> = this.userRole$.pipe(map(role => role === 'admin'));
  public isGuest$: Observable<boolean> = this.userRole$.pipe(map(role => role === 'guest'));

  // --- Hardcoded credentials for demonstration ---
  private readonly ADMIN_USERNAME = '12345';
  private readonly ADMIN_PASSWORD = 'AdminPassword123';
  private readonly STUDENT_USERNAME = '22BAI10072';
  private readonly STUDENT_PASSWORD = 'StudentPassword123';
  private readonly GUEST_USERNAME = 'recruiter';
  private readonly GUEST_PASSWORD = 'demo123';
  // -----------------------------------------

  private readonly isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      // On startup, try to load the session from localStorage
      const storedSession = localStorage.getItem('user_session');
      if (storedSession) {
        this.session.next(JSON.parse(storedSession));
      }
    }
  }

  // Updated login method
  public login(username: string, password: string): Observable<boolean> {
    let sessionData: UserSession | null = null;
    let loginSuccess = false;

    if (username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD) {
      sessionData = { role: 'admin' };
      loginSuccess = true;
    } else if (username === this.STUDENT_USERNAME && password === this.STUDENT_PASSWORD) {
      sessionData = { role: 'student', regNo: username };
      loginSuccess = true;
    } else if (username === this.GUEST_USERNAME && password === this.GUEST_PASSWORD) {
      sessionData = { role: 'guest' };
      loginSuccess = true;
    }

    return of(loginSuccess).pipe(
      delay(500),
      tap(success => {
        if (success && this.isBrowser && sessionData) {
          localStorage.setItem('user_session', JSON.stringify(sessionData));
          this.session.next(sessionData);

          // --- THIS IS THE CRITICAL FIX ---
          // Redirect based on the user's role
          if (sessionData.role === 'guest') {
            this.router.navigate(['/features']);
          } else {
            this.router.navigate(['/home']);
          }

        } else if (!success) {
          this.logout();
        }
      })
    );
  }

  // Logout method now clears the single session object
  public logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('user_session');
      this.session.next(null);
      this.router.navigate(['/login']);
    }
  }
}