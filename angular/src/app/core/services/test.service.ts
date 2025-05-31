import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestConfig, TestResult } from '../../shared/models/test.interface';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getTestConfig(testId: string): Observable<TestConfig> {
    return this.http.get<TestConfig>(`${this.apiUrl}/tests/${testId}/config`);
  }

  saveTestResult(result: TestResult): Observable<TestResult> {
    return this.http.post<TestResult>(`${this.apiUrl}/results`, result);
  }

  getTestResults(userId: string): Observable<TestResult[]> {
    return this.http.get<TestResult[]>(`${this.apiUrl}/results/${userId}`);
  }
} 