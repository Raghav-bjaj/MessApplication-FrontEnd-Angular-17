import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; // Correct path for environment.ts

console.log("At the start of studentService")

interface Student {
  auid?: number; // auid is auto-generated, so it can be optional when sending data
  reg: string;
  date: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  total: number;
}

@Injectable({
  providedIn: 'root'
})

export class StudentService {
  // Use the apiUrl from the imported environment file
  private baseUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }

  home(): Observable<any>{
    return this.http.get(`${this.baseUrl}/home`);
  }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/getStudents`);
  }

  students(reg: string): Observable<Student[]>{
    return this.http.get<Student[]>(`${this.baseUrl}/students/${reg}`);
  }

  studentTotal(reg: string): Observable<number>{
    return this.http.get<number>(`${this.baseUrl}/studentTotal/${reg}`, { responseType: 'json' });
  }

  addStudents( student : Student[]): Observable<string> { // Changed 'object[]' to 'Student[]' for type safety
    return this.http.post<string>(`${this.baseUrl}/students`, student, { responseType: 'text' as 'json' });
  }

  updateStudents(student : Student): Observable<string> { // Changed 'object' to 'Student' for type safety
    return this.http.put<string>(`${this.baseUrl}/students`, student, { responseType: 'text' as 'json' }
    );
  }

  deleteStudents(reg: string, date: string): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/students/${reg}/${date}`, { responseType: 'text' as 'json' });
  }

}

console.log("At the end of studentService")
