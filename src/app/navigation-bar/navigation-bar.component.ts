import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

console.log("At the start of Navigation Component")

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports : [RouterModule],
  template: `
    <nav>
      <a routerLink="/getStudents" routerLinkActive="active">Student List</a> |
      <a routerLink="/students/:reg" routerLinkActive="active"> Particular  Student Detail</a> |
      <a routerLink="/students/add/:reg" routerLinkActive="active">Add Student</a> |
      <a routerLink="/students/update/:reg" routerLinkActive="active">Update Student</a> |
      <a routerLink="/students/delete/:reg/:date" routerLinkActive="active">Delete Student</a> |
      <a routerLink="/students/total/:reg" routerLinkActive="active">Student Total</a>
    </nav>
  `,
  styles: [`
    nav {
      margin: 20px;
    }
    a {
      text-decoration: none;
      padding: 10px;
      color: #333;
    }
    .active {
      font-weight: bold;
    }
  `]
})
export class NavigationComponent {}

console.log("At the end of NAvigation Component")
