
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudentService, Student } from '../student.service';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// Import all necessary Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit, AfterViewInit {
  // Common properties
  isAdmin$: Observable<boolean>;
  displayedColumns: string[] = ['date', 'breakfast', 'lunch', 'dinner', 'total'];
  dataSource = new MatTableDataSource<Student>();
  isLoading = false;

  // Admin-specific properties
  searchForm: FormGroup;
  searched = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private authService: AuthService
  ) {
    this.isAdmin$ = this.authService.isAdmin$;
    this.searchForm = this.fb.group({
      reg: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Check the user's role. If they are a student, fetch their history automatically.
    this.authService.userRole$.pipe(take(1)).subscribe(role => {
      if (role === 'student') {
        this.isLoading = true;
        this.studentService.getMyStudentHistory().subscribe(data => {
          this.dataSource.data = data;
          this.isLoading = false;
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  // Method for admins to fetch a student's history
  fetchStudentDetails() {
    if (this.searchForm.invalid) { return; }
    
    this.isLoading = true;
    this.searched = true;
    const reg = this.searchForm.get('reg')?.value;

    this.studentService.students(reg).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error fetching student details", error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    });
  }
}