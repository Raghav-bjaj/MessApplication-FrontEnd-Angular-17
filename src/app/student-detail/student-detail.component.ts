import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service'; 
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

console.log("At the start of student detail Component");

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  template: `
    <div class="student-detail" [formGroup]="studentForm">
      <h1>Student Details</h1>

      <div>
        <label for="reg">Registration Number:</label>
        <input type="text" formControlName="reg" required>
        <div *ngIf="studentForm.controls['reg'].invalid && studentForm.controls['reg'].touched">
          Registration number is required.
        </div>
        <br>
      </div>

      <button (click)="fetchStudentDetails()">Fetch Details</button>

      <table *ngIf="students && students.length > 0" class="student-table">
        <thead>
          <tr>
            <th>Registration Number</th>
            <th>Date</th>
            <th>Breakfast</th>
            <th>Lunch</th>
            <th>Dinner</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let student of students">
            <td>{{ student.reg }}</td>
            <td>{{ student.date }}</td>
            <td>{{ student.breakfast ? 'Yes' : 'No' }}</td>
            <td>{{ student.lunch ? 'Yes' : 'No' }}</td>
            <td>{{ student.dinner ? 'Yes' : 'No' }}</td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="students && students.length === 0">
        <p>No students found.</p>
      </div>
    </div>
  `,
  styles: [`
    .student-detail {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    h1 {
      color: #333;
    }
    .student-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .student-table th, .student-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;
    }
    .student-table th {
      background-color: #f2f2f2;
    }
  `],
  providers: [StudentService]
})
export class StudentDetailComponent implements OnInit {
  studentForm: FormGroup; // Form group for reactive form
  students: any[] = []; 

  constructor(private fb: FormBuilder, private studentService: StudentService, private route: ActivatedRoute) {
    // Initialize the form with form controls and validators
    this.studentForm = this.fb.group({
      reg: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Perform any necessary initializations
  }

  fetchStudentDetails() {
    if (this.studentForm.valid) {
      const reg = this.studentForm.get('reg')?.value;
      this.studentService.students(reg).subscribe((data: any[]) => {  
        this.students = data;  // Assign the returned list of students to the students array
      }, error => {
        console.error("Error fetching student details", error);
      });
    } else {
      console.error("Invalid Register number");
    }
  }
}

console.log("At the end of student detail Component");
