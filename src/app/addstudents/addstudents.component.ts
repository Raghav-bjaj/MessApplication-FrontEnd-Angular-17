import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudentService } from '../student.service';

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
  responseMessage: string = '';
  isError = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService
  ) {
    // Initialize the form. The 'total' will be calculated by the backend.
    this.studentForm = this.fb.group({
      reg: ['', Validators.required],
      date: [new Date(), Validators.required], // Default to today's date
      breakfast: [false],
      lunch: [false],
      dinner: [false],
    });
  }

  ngOnInit(): void {}

  // Helper method to format a Date object into a "YYYY-MM-DD" string
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  addStudent(): void {
    if (this.studentForm.invalid) {
      return; // If the form is invalid, do nothing.
    }

    this.isLoading = true;
    this.responseMessage = '';
    this.isError = false;

    // Create a copy of the form value to avoid modifying the form directly
    const formValue = { ...this.studentForm.value };
    // Format the date before sending it to the service
    formValue.date = this.formatDate(formValue.date);

    this.studentService.addStudents([formValue]).subscribe({
      next: (response: string) => {
        this.responseMessage = response;
        this.isLoading = false;
        this.resetForm();
      },
      error: (error) => {
        console.error('Error adding student:', error);
        this.responseMessage = 'An error occurred while adding the student record.';
        this.isError = true;
        this.isLoading = false;
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