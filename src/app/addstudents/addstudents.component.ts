import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudentService, Student } from '../student.service';
import { AuthService } from '../auth.service'; // <-- Import AuthService
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './addstudents.component.html',
  styleUrls: ['./addstudents.component.css']
})
export class AddStudentComponent implements OnInit {
  studentForm: FormGroup;
  isLoading = false;
  isGuest = false; // Property to track guest status

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private snackBar: MatSnackBar,
    private authService: AuthService // <-- Inject AuthService
  ) {
    this.studentForm = this.fb.group({
      reg: ['', Validators.required],
      date: [new Date(), Validators.required],
      breakfast: [false],
      lunch: [false],
      dinner: [false]
    });
  }

  ngOnInit(): void {
      // Check the user's role when the component initializes
      this.authService.userRole$.pipe(take(1)).subscribe(role => {
        this.isGuest = role === 'guest';
      });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  addStudent(): void {
    // --- THIS IS THE NEW GUEST CHECK ---
    if (this.isGuest) {
      this.snackBar.open('You are a guest and not authorised for this action.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return; // Stop the function here
    }
    // ------------------------------------

    if (this.studentForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formValue = this.studentForm.getRawValue();
    const payload: Student = {
      ...formValue,
      date: this.formatDate(formValue.date)
    };

    this.studentService.addStudents([payload]).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open(response, 'Close', { duration: 3000, panelClass: 'success-snackbar' });
        this.resetForm();
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error.error || 'An error occurred while adding the student.';
        this.snackBar.open(errorMessage, 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        console.error('Error adding student:', error);
      }
    });
  }

  resetForm(): void {
    this.studentForm.reset({
      reg: '',
      date: new Date(),
      breakfast: false,
      lunch: false,
      dinner: false
    });
  }
}

