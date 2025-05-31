import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestResult } from '../../shared/models/test.interface';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  saveResult(result: TestResult): Observable<TestResult> {
    return this.http.post<TestResult>(`${this.apiUrl}/results`, result);
  }

  getResultsByUser(userId: string): Observable<TestResult[]> {
    return this.http.get<TestResult[]>(`${this.apiUrl}/results/user/${userId}`);
  }

  getResultsByTest(testId: string): Observable<TestResult[]> {
    return this.http.get<TestResult[]>(`${this.apiUrl}/results/test/${testId}`);
  }

  getResultById(resultId: string): Observable<TestResult> {
    return this.http.get<TestResult>(`${this.apiUrl}/results/${resultId}`);
  }

  deleteResult(resultId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/results/${resultId}`);
  }
} 