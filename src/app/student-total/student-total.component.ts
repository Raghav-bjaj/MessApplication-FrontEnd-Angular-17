import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

console.log("At the start of studenTotal Component");

@Component({
  selector: 'app-student-total',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  template: `
    <div class="student-list">
      <h1>Student Total</h1>

      <form [formGroup]="studentForm" (ngSubmit)="fetchStudentTotal()">
        <div>
          <label for="reg">Registration Number:</label>
          <input type="text" formControlName="reg" required>
          <div *ngIf="studentForm.controls['reg'].invalid && studentForm.controls['reg'].touched">
            Registration number is required.
          </div>
          <br>
        </div>

        <button type="submit">Fetch Total</button>
      </form>

      <!-- Display the registration number and total -->
      <div *ngIf="studentTotal !== undefined">
        <p>Total: {{ studentTotal }}</p>
      </div>

      <!-- Display the response message -->
      <div *ngIf="responseMessage" class="response-message">
        {{ responseMessage }}
      </div>
    </div>
  `,
  styles: [`
    .student-list {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    h1 {
      color: #333;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      padding: 5px 0;
      border-bottom: 1px solid #ddd;
    }
  `],
  providers: [StudentService]
})

export class StudentTotalComponent implements OnInit {

  responseMessage: string = '';
  studentTotal?: number;  // Use `?` to denote that this value can be undefined
  studentForm: FormGroup;

  constructor(private fb: FormBuilder, private studentService: StudentService) {
    this.studentForm = this.fb.group({
      reg: ['', Validators.required],
    });
  }  
  
  ngOnInit() {}

  fetchStudentTotal() {
    const reg = this.studentForm.get('reg')?.value;
    if (this.studentForm.valid) {
      this.studentService.studentTotal(reg).subscribe({
        next: (data: number) => {  
          this.studentTotal = data;  
          this.responseMessage = ''; 
        },
        error: (error: any) => {
          console.error('Error fetching student total:', error);
          this.responseMessage = 'An error occurred while fetching the student total.';
          this.studentTotal = undefined; 
        }
      });
    } else {
      console.warn('Form is invalid');
      this.responseMessage = 'Please provide a registration number.';
      this.studentTotal = undefined; 
    }
  }
}

console.log("At the end of studenTotal Component");
