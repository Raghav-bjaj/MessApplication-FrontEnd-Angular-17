import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service'; 
import { HttpClientModule } from '@angular/common/http';

console.log("At the start of studentList Component")

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  //inline template and styles
  template: `
    <div class="student-list">
  <h1>Student List</h1>
  <table>
    <thead>
      <tr>
        <!-- Table headers -->
        
        <th>Registration Number</th>
        <th>Date</th>
        <th>Breakfast</th>
        <th>Lunch</th>
        <th>Dinner</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <!-- Iterate over students and display their details in table rows -->
      <tr *ngFor="let student of students">
      
        <td>{{ student.reg }}</td>
        <td>{{ student.date }}</td>
        <td>{{ student.breakfast ? 'Yes' : 'No' }}</td>
        <td>{{ student.lunch ? 'Yes' : 'No' }}</td>
        <td>{{ student.dinner ? 'Yes' : 'No' }}</td>
        <td>{{ student.total }}</td>
      </tr>
    </tbody>
  </table>
</div>

  `,

/*<div class="student-list">
<h1>Student List</h1>
<ul>
  <li *ngFor="let student of students">
    <!-- Display student details -->
    <strong>Name:</strong> {{ student.name }} <br>
    <strong>Registration Number:</strong> {{ student.reg }} <br>
    <strong>Breakfast:</strong> {{ student.breakfast ? 'Yes' : 'No' }} <br>
    <strong>Lunch:</strong> {{ student.lunch ? 'Yes' : 'No' }} <br>                   to display in a different type
    <strong>Dinner:</strong> {{ student.dinner ? 'Yes' : 'No' }} <br>
    <strong>Total:</strong> {{ student.total }} <br>
    <hr> <!-- Horizontal line to separate each student -->
  </li>
</ul>
</div>
*/
  //templateUrl: './student-list.component.html',
  //styleUrl: './student-list.component.css'
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
export class StudentListComponent implements OnInit {

  students: any[] = [];

  constructor(private StudentService: StudentService) {}

  ngOnInit() {
    this.StudentService.getStudents().subscribe((data: any[]) => { 
      this.students = data;
  });

}
  

}

console.log("At the end of studentList Component")

