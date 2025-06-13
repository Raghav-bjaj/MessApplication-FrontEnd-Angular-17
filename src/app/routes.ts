// src/app/routes.ts

import { Routes } from '@angular/router';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { AddStudentComponent } from './addstudents/addstudents.component';
import { UpdateStudentComponent } from './update-student/update-student.component';
import { DeleteStudentComponent} from './delete-student/delete-student.component';
import { StudentTotalComponent } from './student-total/student-total.component';
import { StudentListComponent } from './student-list/student-list.component';
import { LoginComponent } from './login/login.component'; // Import the new Login Component
import { AuthGuard } from './auth.guard'; // Import the AuthGuard


console.log("At the start of Routes Component")


export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Add a route for the login page
  { path: '', redirectTo: '/getStudents', pathMatch: 'full' }, // Redirect empty path to students list
  { path: 'getStudents', component: StudentListComponent, canActivate: [AuthGuard] }, // Protect this route
  { path: 'students/:reg', component: StudentDetailComponent, canActivate: [AuthGuard] }, // Protect this route
  { path: 'students/add/:reg', component: AddStudentComponent, canActivate: [AuthGuard] }, // Protect this route
  { path: 'students/update/:reg', component: UpdateStudentComponent, canActivate: [AuthGuard] }, // Protect this route
  { path: 'students/delete/:reg/:date', component: DeleteStudentComponent, canActivate: [AuthGuard] }, // Protect this route
  { path: 'students/total/:reg', component: StudentTotalComponent, canActivate: [AuthGuard] }, // Protect this route
  { path: '**', redirectTo: '/login' } // Redirect unknown paths to login if not authenticated
];

console.log("At the end of routes Component")
