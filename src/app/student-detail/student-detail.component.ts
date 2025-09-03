
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudentService, Student } from '../student.service';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

// Import all necessary Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip'; // <-- Import Tooltip

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatTableModule, MatSortModule,
    MatProgressSpinnerModule, MatIconModule, MatTooltipModule // <-- Add Tooltip
  ],
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit, AfterViewInit {
  // Observables to manage the view based on user role
  isAdminView$: Observable<boolean>;
  isStudentView$: Observable<boolean>;
  isGuest$: Observable<boolean>;

  displayedColumns: string[] = ['date', 'breakfast', 'lunch', 'dinner', 'total'];
  dataSource = new MatTableDataSource<Student>();
  isLoading = false;

  // Admin/Guest properties
  searchForm: FormGroup;
  searched = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private authService: AuthService
  ) {
    // Determine which view to show based on the user's role
    this.isAdminView$ = this.authService.userRole$.pipe(map(role => role === 'admin' || role === 'guest'));
    this.isStudentView$ = this.authService.userRole$.pipe(map(role => role === 'student'));
    this.isGuest$ = this.authService.isGuest$;

    this.searchForm = this.fb.group({
      reg: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.userRole$.pipe(take(1)).subscribe(role => {
      // --- GUEST LOGIC ---
      if (role === 'guest') {
        // Pre-fill the form with the masked reg number and disable it
        this.searchForm.patchValue({ reg: '22B*****72' });
        this.searchForm.disable(); // Disable the form for guests
        // Automatically fetch the history for the hardcoded demo student
        this.fetchStudentDetails('22BAI10072');
      }
      // --- STUDENT LOGIC ---
      else if (role === 'student') {
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

  // Method for admins/guests to fetch a student's history
  // Now accepts an optional reg number for the guest auto-search
  fetchStudentDetails(regNumber?: string) {
    // If a regNumber is passed directly (by the guest logic), use it.
    // Otherwise, get it from the form (for admin).
    const reg = regNumber || this.searchForm.get('reg')?.value;

    if (!reg) { return; }
    
    this.isLoading = true;
    this.searched = true;

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