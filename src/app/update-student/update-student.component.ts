
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudentService, Student } from '../student.service';

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
  templateUrl: './update-student.component.html',
  styleUrls: ['./update-student.component.css']
})
export class UpdateStudentComponent implements OnInit {
  searchForm: FormGroup;
  studentForm: FormGroup;
  
  responseMessage: string = '';
  isError = false;
  isLoading = false;
  studentData: Student | null = null; // To hold the fetched student record

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService
  ) {
    // Form for searching for a student record
    this.searchForm = this.fb.group({
      reg: ['', Validators.required],
      date: [new Date(), Validators.required]
    });

    // Form for updating the student record (initially disabled)
    this.studentForm = this.fb.group({
      reg: [{ value: '', disabled: true }], // Reg and date are non-editable
      date: [{ value: '', disabled: true }],
      breakfast: [false],
      lunch: [false],
      dinner: [false]
    });
  }

  ngOnInit(): void {}

  // Helper to format date to "YYYY-MM-DD"
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Step 1: Search for the student record
  searchStudent(): void {
    if (this.searchForm.invalid) { return; }

    this.isLoading = true;
    this.studentData = null;
    this.responseMessage = '';
    this.isError = false;

    const reg = this.searchForm.value.reg;
    const date = this.formatDate(this.searchForm.value.date);

    // We use the `students` method which should return a list.
    // We expect a list with one item if the record is found.
    this.studentService.students(reg).subscribe({
      next: (students) => {
        // Find the specific record for the chosen date from the results
        const record = students.find(s => s.date === date);
        if (record) {
          this.studentData = record;
          // Populate the update form with the fetched data
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

  // Step 2: Update the student record
  updateStudent(): void {
    if (this.studentForm.invalid || !this.studentData) { return; }

    this.isLoading = true;
    this.responseMessage = '';
    this.isError = false;

    // Construct the payload with the updated values
    const updatedRecord: Student = {
      ...this.studentData, // Start with existing data (like auid)
      ...this.studentForm.value // Override with form values
    };

    this.studentService.updateStudents(updatedRecord).subscribe({
      next: (response) => {
        this.responseMessage = response;
        this.isLoading = false;
        // Reset to the search state after a successful update
        this.studentData = null; 
        this.searchForm.reset({ date: new Date() });
      },
      error: (err) => {
        this.responseMessage = 'Failed to update record.';
        this.isError = true;
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
