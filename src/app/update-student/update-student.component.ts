import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';  
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

console.log("At the start of studenUPP Component")


@Component({
  selector: 'app-update-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="update-student">
      <h2>Update Student</h2>
      <form [formGroup]="studentForm" (ngSubmit)="updateStudent()">
        
        
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
        <button type="submit" [disabled]="studentForm.invalid">Update Student</button>
      </form>


      <!-- Display the response message -->
      <div *ngIf="responseMessage" class="response-message">
        {{ responseMessage }}
      </div>
    </div>
  `,
  styles: [`
    .update-student {
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
  `],
  providers: [StudentService]
})
export class UpdateStudentComponent implements OnInit {
  studentForm: FormGroup; // Form group for reactive form
  responseMessage: string = ''; // Property to store the response message
  
  student: any = {  // Initial state for the student object with default values
    name: '',
    reg: '',
    breakfast: false,
    lunch: false,
    dinner: false,
    total: null
  };

  constructor(
    private studentService: StudentService, private fb: FormBuilder, 
    private route: ActivatedRoute  // Inject ActivatedRoute to get route parameters
  ) {
    this.studentForm = this.fb.group({
      
      reg: ['', Validators.required],
      date: ['', Validators.required],
      breakfast: [false],
      lunch: [false],
      dinner: [false],
      total: [null]
    });
  }

  ngOnInit(): void {
    
  }

  

  updateStudent(): void {
    if (this.studentForm.valid) { // Only submit if the form is valid
      this.studentService.updateStudents(this.studentForm.value).subscribe(
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

console.log("At the end of studenUPP Component")