import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, switchMap, take } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

export interface Student {
  auid?: number;
  reg: string;
  date: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  total: number;
}

// New DTO interface for the dues report
export interface StudentDue {
  reg: string;
  totalDue: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // --- NEW METHOD for the admin's total dues report ---
  getTotalDues(startDate: string, endDate: string): Observable<StudentDue[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<StudentDue[]>(`${this.baseUrl}/students/dues`, { params });
  }

  // --- NEW "SMART" METHOD for a student to get their own history ---
  getMyStudentHistory(): Observable<Student[]> {
    return this.authService.currentUserRegNo$.pipe(
      filter(regNo => regNo !== null),
      take(1),
      switchMap(regNo => {
        return this.students(regNo!);
      })
    );
  }

  // --- Method to fetch student list by a specific date ---
  getStudentsByDate(date: string): Observable<Student[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<Student[]>(`${this.baseUrl}/getStudents`, { params });
  }

  // --- Method for admin to look up a specific student's total ---
  studentTotalByReg(reg: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/studentTotal/${reg}`);
  }

  // --- "Smart" method for a logged-in student to get their own total ---
  getMyStudentTotal(): Observable<number> {
    return this.authService.currentUserRegNo$.pipe(
      filter(regNo => regNo !== null),
      take(1),
      switchMap(regNo => {
        return this.http.get<number>(`${this.baseUrl}/studentTotal/${regNo}`);
      })
    );
  }

  // --- Your other original methods ---
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/getStudents`);
  }

  students(reg: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students/${reg}`);
  }

  addStudents(student: Student[]): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/students`, student, { responseType: 'text' as 'json' });
  }

  updateStudents(student: Student): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/students`, student, { responseType: 'text' as 'json' });
  }

  deleteStudents(reg: string, date: string): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/students/${reg}/${date}`, { responseType: 'text' as 'json' });
  }
}