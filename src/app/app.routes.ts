
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { StudentTotalComponent } from './student-total/student-total.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentDuesComponent } from './student-dues/student-dues.component';
import { AddStudentComponent } from './addstudents/addstudents.component';
import { UpdateStudentComponent } from './update-student/update-student.component';
import { DeleteStudentComponent } from './delete-student/delete-student.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { MenuComponent } from './menu/menu.component';
import { FeaturesComponent } from './features/features.component';
import { authGuard } from './auth.guard';
import { loginGuard } from './login/login.guard';
import { guestGuard } from './guest.guard';

export const routes: Routes = [
  // Public & Guest Routes
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'features', component: FeaturesComponent, canActivate: [guestGuard] },

  // Authenticated Routes (Admin & Student)
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'menu/:type', component: MenuComponent, canActivate: [authGuard] },
  { path: 'students/total', component: StudentTotalComponent, canActivate: [authGuard] },
  { path: 'students/detail', component: StudentDetailComponent, canActivate: [authGuard] },

  // Admin-Only Routes
  { path: 'getStudents', component: StudentListComponent, canActivate: [authGuard] },
  { path: 'students/dues', component: StudentDuesComponent, canActivate: [authGuard] },
  { path: 'students/add/new', component: AddStudentComponent, canActivate: [authGuard] },
  { path: 'students/update', component: UpdateStudentComponent, canActivate: [authGuard] },
  { path: 'students/delete', component: DeleteStudentComponent, canActivate: [authGuard] },


  // Default and Wildcard Redirects
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];