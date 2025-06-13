import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';  // Adjust path as necessary
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

console.log("At the start of studentADD Component");

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="add-student">
      <h2>Add Student</h2>
      <form [formGroup]="studentForm" (ngSubmit)="addStudent()">
        
        
        <!-- Registration Field -->
        <label for="reg">Registration Number:</label>
        <input type="text" formControlName="reg" required>
        <div *ngIf="studentForm.controls['reg'].invalid && studentForm.controls['reg'].touched">
          Registration number is required.
        </div>
        <br>

        <!-- Date Field -->
        <label for="date">Date:</label>
        <input type="text" formControlName="date">
        <div *ngIf="studentForm.controls['date'].invalid && studentForm.controls['date'].touched">
          Date is required.
        </div>
        <br>

        <!-- Breakfast Field -->
        <label for="breakfast">Breakfast:</label>
        <input type="checkbox" formControlName="breakfast">
        <br>

        <!-- Lunch Field -->
        <label for="lunch">Lunch:</label>
        <input type="checkbox" formControlName="lunch">
        <br>

        <!-- Dinner Field -->
        <label for="dinner">Dinner:</label>
        <input type="checkbox" formControlName="dinner">
        <br>

        

        <!-- Submit Button -->
        <button type="submit" [disabled]="studentForm.invalid">Add Student</button>
      </form>

      <!-- Display the response message -->
      <div *ngIf="responseMessage" class="response-message">
        {{ responseMessage }}
      </div>
    </div>
  `,
  styles: [`
    .add-student {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    h2 {
      color: #333;
    }
    form {
      margin-top: 20px;
    }
    label {
      margin-right: 10px;
    }
    .response-message {
      margin-top: 20px;
      padding: 10px;
      background-color: #e6ffe6;
      border: 1px solid #00cc00;
      color: #006600;
    }
    .error-message {
      color: red;
      font-size: 12px;
      margin-top: 5px;
    }
  `],
  providers: [StudentService]
})
export class AddStudentComponent implements OnInit {
  studentForm: FormGroup; // Form group for reactive form
  responseMessage: string = ''; // Property to store the response message

  constructor(private fb: FormBuilder, private studentService: StudentService, private route: ActivatedRoute) {
    // Initialize the form with form controls and validators
    this.studentForm = this.fb.group({
      
      reg: ['', Validators.required],
      date: ['', Validators.required],
      breakfast: [false],
      lunch: [false],
      dinner: [false],
      total: [null]
    });
  }

  ngOnInit(): void {}

  addStudent(): void {
    if (this.studentForm.valid) { // Only submit if the form is valid
      this.studentService.addStudents([this.studentForm.value]).subscribe(
        (response: string) => {
          console.log(response);
          this.responseMessage = response;  
          //alert(response);
          this.resetForm(); 
        },
        (error) => {
          console.error('Error adding student:', error);
          this.responseMessage = 'An error occurred while adding the student.';
        }
      );
    } else {
      console.warn('Form is invalid');
    }
  }

  
  resetForm(): void {
    this.studentForm.reset({
      name: '',
      reg: '',
      breakfast: false,
      lunch: false,
      dinner: false,
      total: null
    });
  }
}

console.log("At the end of studentADD Component");
