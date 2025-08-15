import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms'; // Import necessary form modules
import { StudentService, Student } from '../student.service';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

// Import all necessary Angular Material modules
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker'; // For the date picker
import { MatNativeDateModule } from '@angular/material/core'; // For the date picker
import { MatButtonModule } from '@angular/material/button'; // For the search button

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['reg', 'date', 'breakfast', 'lunch', 'dinner', 'total'];
  dataSource = new MatTableDataSource<Student>();
  isLoading = true;
  selectedDate: string;
  isAdmin$: Observable<boolean>;

  // A form control to manage the date picker's value
  dateControl = new FormControl(new Date());

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private studentService: StudentService,
    private authService: AuthService // Inject AuthService to check role
  ) {
    this.isAdmin$ = this.authService.isAdmin$;
    // Set the initial date to today
    this.selectedDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.fetchStudentData(this.selectedDate);
  }

  // A reusable method to fetch data for a given date
  fetchStudentData(date: string): void {
    this.isLoading = true;
    this.selectedDate = date; // Update the displayed date
    this.studentService.getStudentsByDate(date).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to fetch student list:", err);
        this.isLoading = false;
      }
    });
  }

  // This method is called when the admin searches for a new date
  searchByDate(): void {
    if (this.dateControl.value) {
      const newDate = this.dateControl.value;
      const formattedDate = newDate.toISOString().split('T')[0];
      this.fetchStudentData(formattedDate);
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
