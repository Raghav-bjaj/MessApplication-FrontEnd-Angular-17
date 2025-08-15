import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../student.service';
import { AuthService } from '../auth.service';
import { Observable, of } from 'rxjs'; // <-- Import `of`
import { take } from 'rxjs/operators';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-student-total',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './student-total.component.html',
  styleUrls: ['./student-total.component.css']
})
export class StudentTotalComponent implements OnInit {
  isAdmin$!: Observable<boolean>;
  // Initialize with a default observable using `of()`
  studentTotal$: Observable<number> = of(0);
  regNo$: Observable<string | null> = of(null);
  adminForm: FormGroup;
  adminTotal?: number;
  responseMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private authService: AuthService
  ) {
    this.adminForm = this.fb.group({
      reg: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.isAdmin$ = this.authService.isAdmin$;
    this.authService.userRole$.pipe(take(1)).subscribe(role => {
      if (role === 'student') {
        this.studentTotal$ = this.studentService.getMyStudentTotal();
        this.regNo$ = this.authService.currentUserRegNo$;
      }
    });
  }

  fetchAdminTotal() {
    if (this.adminForm.invalid) {
      this.responseMessage = 'Please provide a registration number.';
      return;
    }
    const reg = this.adminForm.get('reg')?.value;
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
