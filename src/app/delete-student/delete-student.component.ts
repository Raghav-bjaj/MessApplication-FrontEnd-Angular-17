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
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-delete-student',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule,
    MatProgressSpinnerModule, MatIconModule, MatDividerModule
  ],
  templateUrl: './delete-student.component.html',
  styleUrls: ['./delete-student.component.css']
})
export class DeleteStudentComponent implements OnInit {
  searchForm: FormGroup;
  isLoading = false;
  foundStudent: Student | null = null;
  errorMessage: string = '';
  isGuest = false; // Property to track guest status

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private snackBar: MatSnackBar,
    private authService: AuthService // <-- Inject AuthService
  ) {
    this.searchForm = this.fb.group({
      reg: ['', Validators.required],
      date: [new Date(), Validators.required]
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

  findRecord(): void {
    if (this.searchForm.invalid) { return; }

    this.isLoading = true;
    this.foundStudent = null;
    this.errorMessage = '';
    const reg = this.searchForm.value.reg;
    const date = this.formatDate(this.searchForm.value.date);

    this.studentService.students(reg).subscribe({
      next: (students) => {
        const record = students.find(s => s.date === date);
        if (record) {
          this.foundStudent = record;
        } else {
          this.errorMessage = `No record found for ${reg} on ${date}.`;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'An error occurred while searching for the record.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  deleteRecord(): void {
    // --- THIS IS THE NEW GUEST CHECK ---
    if (this.isGuest) {
      this.snackBar.open('You are a guest and not authorised for this action.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return; // Stop the function here
    }
    // ------------------------------------

    if (!this.foundStudent) { return; }

    this.isLoading = true;
    const { reg, date } = this.foundStudent;

    this.studentService.deleteStudents(reg, date).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open(response, 'Close', { duration: 3000, panelClass: 'success-snackbar' });
        this.resetForm();
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Failed to delete the record.', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
        console.error(err);
      }
    });
  }

  cancelDelete(): void {
    this.foundStudent = null;
    this.errorMessage = '';
  }

  resetForm(): void {
    this.searchForm.reset({ date: new Date() });
    this.foundStudent = null;
    this.errorMessage = '';
  }
}

