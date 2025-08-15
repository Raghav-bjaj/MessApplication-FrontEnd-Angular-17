import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { StudentService, StudentDue } from '../student.service';

// Import all necessary Angular Material modules
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-student-dues',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './student-dues.component.html',
  styleUrls: ['./student-dues.component.css']
})
export class StudentDuesComponent implements AfterViewInit {
  displayedColumns: string[] = ['reg', 'totalDue'];
  dataSource = new MatTableDataSource<StudentDue>();
  isLoading = false;
  grandTotal = 0;

  // Create a form group for the date range picker
  range = new FormGroup({
    start: new FormControl<Date | null>(null, Validators.required),
    end: new FormControl<Date | null>(null, Validators.required),
  });

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private studentService: StudentService) {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  // Method to fetch the dues report from the service
  fetchDuesReport(): void {
    if (this.range.invalid) {
      return;
    }
    this.isLoading = true;
    const startDate = this.formatDate(this.range.value.start!);
    const endDate = this.formatDate(this.range.value.end!);

    this.studentService.getTotalDues(startDate, endDate).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.calculateGrandTotal();
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to fetch dues report:", err);
        this.isLoading = false;
      }
    });
  }

  // Helper method to calculate the grand total of all dues
  private calculateGrandTotal(): void {
    this.grandTotal = this.dataSource.data.reduce((acc, curr) => acc + curr.totalDue, 0);
  }

  // Helper method to format a Date object into a "YYYY-MM-DD" string
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}

