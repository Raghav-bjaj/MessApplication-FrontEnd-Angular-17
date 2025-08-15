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
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-delete-student',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './delete-student.component.html',
  styleUrls: ['./delete-student.component.css']
})
export class DeleteStudentComponent implements OnInit {
  searchForm: FormGroup;
  
  responseMessage: string = '';
  isError = false;
  isLoading = false;
  foundStudent: Student | null = null; // To hold the fetched student record for confirmation

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService
  ) {
    // Form for searching for the record to delete
    this.searchForm = this.fb.group({
      reg: ['', Validators.required],
      date: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {}

  // Helper to format date to "YYYY-MM-DD"
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Step 1: Search for the student record
  searchForRecord(): void {
    if (this.searchForm.invalid) { return; }

    this.isLoading = true;
    this.foundStudent = null;
    this.responseMessage = '';
    this.isError = false;

    const reg = this.searchForm.value.reg;
    const date = this.formatDate(this.searchForm.value.date);

    this.studentService.students(reg).subscribe({
      next: (students) => {
        const record = students.find(s => s.date === date);
        if (record) {
          this.foundStudent = record;
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

  // Step 2: Delete the confirmed student record
  deleteTheStudent(): void {
    if (!this.foundStudent) { return; }

    this.isLoading = true;
    this.responseMessage = '';
    this.isError = false;

    const reg = this.foundStudent.reg;
    const date = this.foundStudent.date;

    this.studentService.deleteStudents(reg, date).subscribe({
      next: (response) => {
        this.responseMessage = response;
        this.isLoading = false;
        this.foundStudent = null; // Reset to the search state
        this.searchForm.reset({ date: new Date() });
      },
      error: (err) => {
        this.responseMessage = 'Failed to delete record.';
        this.isError = true;
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}