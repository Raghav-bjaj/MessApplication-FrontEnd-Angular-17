import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudentService, Student } from '../student.service';
import { AuthService } from '../auth.service'; // <-- Import AuthService
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

// Import all necessary Angular Material modules
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
  selector: 'app-update-student',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule,
    MatButtonModule, MatProgressSpinnerModule, MatIconModule
  ],
  templateUrl: './update-student.component.html',
  styleUrls: ['./update-student.component.css']
})
export class UpdateStudentComponent implements OnInit {
  searchForm: FormGroup;
  studentForm: FormGroup;
  
  responseMessage: string = '';
  isError = false;
  isLoading = false;
  studentData: Student | null = null;
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

    this.studentForm = this.fb.group({
      reg: [{ value: '', disabled: true }],
      date: [{ value: '', disabled: true }],
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

  searchStudent(): void {
    if (this.searchForm.invalid) { return; }

    this.isLoading = true;
    this.studentData = null;
    this.responseMessage = '';
    this.isError = false;
    const reg = this.searchForm.value.reg;
    const date = this.formatDate(this.searchForm.value.date);

    this.studentService.students(reg).subscribe({
      next: (students) => {
        const record = students.find(s => s.date === date);
        if (record) {
          this.studentData = record;
          this.studentForm.patchValue({
            reg: record.reg,
            date: record.date,
            breakfast: record.breakfast,
            lunch: record.lunch,
            dinner: record.dinner
          });
        } else {
          this.responseMessage = `No record found for ${reg} on ${date}.`;
          this.isError = true;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.responseMessage = 'Error fetching student data.';
        this.isError = true;
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  updateStudent(): void {
    // --- THIS IS THE NEW GUEST CHECK ---
    if (this.isGuest) {
      this.snackBar.open('You are a guest and not authorised for this action.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return; // Stop the function here
    }
    // ------------------------------------

    if (this.studentForm.invalid || !this.studentData) { return; }

    this.isLoading = true;
    this.responseMessage = '';
    this.isError = false;
    const updatedRecord: Student = {
      ...this.studentData,
      ...this.studentForm.value
    };

    this.studentService.updateStudents(updatedRecord).subscribe({
      next: (response) => {
        this.responseMessage = response;
        this.isLoading = false;
        this.studentData = null; 
        this.searchForm.reset({ date: new Date() });
        this.snackBar.open('Record updated successfully!', 'Close', { duration: 3000, panelClass: 'success-snackbar' });
      },
      error: (err) => {
        this.responseMessage = 'Failed to update record.';
        this.isError = true;
        this.isLoading = false;
        console.error(err);
        this.snackBar.open('Failed to update record.', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
      }
    });
  }
}

