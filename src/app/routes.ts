import { Routes } from '@angular/router';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { AddStudentComponent } from './addstudents/addstudents.component';
import { UpdateStudentComponent } from './update-student/update-student.component';
import { DeleteStudentComponent} from './delete-student/delete-student.component';
import { StudentTotalComponent } from './student-total/student-total.component';
import { StudentListComponent } from './student-list/student-list.component';



console.log("At the start of Routes Component")


export const routes: Routes = [
  //{ path: '', redirectTo: '/getstudents', pathMatch: 'full' }, // Redirect empty path to students list
  { path: 'getStudents', component: StudentListComponent },
  { path: 'students/:reg', component: StudentDetailComponent },
  { path: 'students/add/:reg', component: AddStudentComponent },
  { path: 'students/update/:reg', component: UpdateStudentComponent },
  { path: 'students/delete/:reg/:date', component: DeleteStudentComponent },
  { path: 'students/total/:reg', component: StudentTotalComponent },
  { path: '**', redirectTo: '/getStudents' } // Redirect unknown paths to the students list
];

console.log("At the end of routes Component")
