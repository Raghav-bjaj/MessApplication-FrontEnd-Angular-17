import { Component } from '@angular/core';
import { StudentService } from '../student.service';  
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

console.log("At the start of studenDEL Component")

@Component({
  selector: 'app-delete-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="delete-student" [formGroup]="studentForm">
      <h1>Delete Student </h1>

      <div>
        <label for="reg">Registration Number:</label>
        <input type="text" formControlName="reg" required>
        <div *ngIf="studentForm.controls['reg'].invalid && studentForm.controls['reg'].touched">
          Registration number is required.
        </div>
        <br>
      </div>

      <div>
        <label for="date">Date:</label>
        <input type="text" formControlName="date" required>
        <div *ngIf="studentForm.controls['date'].invalid && studentForm.controls['date'].touched">
          Date is required.
        </div>
        <br>
      </div>



      <button (click)="deleteTheStudent()">Delete</button>

      <!-- Display the response message -->
      <div *ngIf="responseMessage" class="response-message">
        {{ responseMessage }}
      </div>
    </div>
  `,
  styles: [`
    .delete-student {
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
export class DeleteStudentComponent {

  studentForm: FormGroup;
  responseMessage: string = ''; 
  constructor(private fb: FormBuilder, private studentService: StudentService, private route: ActivatedRoute) {
    this.studentForm = this.fb.group({
      reg: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  reg = this.route.snapshot.paramMap.get('Reg'); 

  deleteTheStudent(): void {
    if (this.studentForm.valid) { // Only submit if the form is valid
      const reg = this.studentForm.get('reg')?.value;
      const date = this.studentForm.get('date')?.value; 
      this.studentService.deleteStudents(reg, date).subscribe(
        (response: string) => {
          console.log(response);
          this.responseMessage = response;  
          //alert(response);
          this.resetForm(); 
        },
        (error) => {
          console.error('Error Deletinig student:', error);
          this.responseMessage = 'An error occurred while adding the student.';
        }
      );
    } else {
      console.warn('Form is invalid');
    }
  }
resetForm(): void {
  this.studentForm.reset({
    reg: '',
    date:'',
  });
}
}
console.log("At the end of studenDEL Component")