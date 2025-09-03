
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../student.service';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip'; // <-- Import Tooltip

@Component({
  selector: 'app-student-total',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatProgressSpinnerModule,
    MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTooltipModule // <-- Add Tooltip
  ],
  templateUrl: './student-total.component.html',
  styleUrls: ['./student-total.component.css']
})
export class StudentTotalComponent implements OnInit {
  // Observables to manage the view based on user role
  isAdminView$: Observable<boolean>;
  isStudentView$: Observable<boolean>;
  isGuest$: Observable<boolean>;

  // Student-specific properties
  studentTotal$!: Observable<number>;
  regNo$!: Observable<string | null>;

  // Admin/Guest properties
  adminForm: FormGroup;
  adminTotal?: number;
  responseMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private authService: AuthService
  ) {
    // Determine which view to show based on the user's role
    this.isAdminView$ = this.authService.userRole$.pipe(map(role => role === 'admin' || role === 'guest'));
    this.isStudentView$ = this.authService.userRole$.pipe(map(role => role === 'student'));
    this.isGuest$ = this.authService.isGuest$;

    this.adminForm = this.fb.group({
      reg: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.userRole$.pipe(take(1)).subscribe(role => {
      // --- GUEST LOGIC ---
      if (role === 'guest') {
        // Pre-fill the form with the masked reg number and disable it
        this.adminForm.patchValue({ reg: '22B*****72' });
        this.adminForm.disable(); // Disable the form for guests
        // Automatically fetch the total for the hardcoded demo student
        this.fetchTotal('22BAI10072');
      }
      // --- STUDENT LOGIC ---
      else if (role === 'student') {
        this.studentTotal$ = this.studentService.getMyStudentTotal();
        this.regNo$ = this.authService.currentUserRegNo$;
      }
    });
  }

  // Method for admins/guests to fetch a total
  fetchTotal(regNumber?: string) {
    // If a regNumber is passed directly (by the guest logic), use it.
    // Otherwise, get it from the form (for admin).
    const reg = regNumber || this.adminForm.get('reg')?.value;

    if (!reg) {
      this.responseMessage = 'Please provide a registration number.';
      return;
    }

    this.studentService.studentTotalByReg(reg).subscribe({
      next: (data: number) => {
        this.adminTotal = data;
        this.responseMessage = `Total for ${reg}:`;
      },
      error: (error: any) => {
        console.error('Error fetching student total:', error);
        this.responseMessage = 'An error occurred or student not found.';
        this.adminTotal = undefined;
      }
    });
  }
}