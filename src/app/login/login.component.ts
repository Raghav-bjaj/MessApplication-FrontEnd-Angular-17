import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage: string | null = null;
  isLoading = false;

  constructor(private authService: AuthService) { }

  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Both username and password are required.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        if (!success) {
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'An error occurred. Please try again later.';
        console.error('Login error:', error);
        this.isLoading = false;
      }
    });
  }
}