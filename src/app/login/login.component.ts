// src/app/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for ngIf
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { AuthService } from '../auth.service'; // Import your auth service

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Make sure these are imported
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form (ngSubmit)="onLogin()">
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" [(ngModel)]="password" name="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
      <p *ngIf="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  `,
  styles: `
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      background-color: #fff;
      text-align: center;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input[type="password"] {
      width: calc(100% - 20px);
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      background-color: #007bff;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    button:hover {
      background-color: #0056b3;
    }
    .error-message {
      color: red;
      margin-top: 10px;
    }
  `
})
export class LoginComponent {
  password = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService) { }

  onLogin(): void {
    this.errorMessage = null; // Clear previous errors
    this.authService.login(this.password).subscribe(
      (success) => {
        if (!success) {
          this.errorMessage = 'Invalid password. Please try again.';
        }
        // Navigation is handled by the AuthService
      },
      (error) => {
        this.errorMessage = 'An error occurred during login. Please try again later.';
        console.error('Login error:', error);
      }
    );
  }
}
