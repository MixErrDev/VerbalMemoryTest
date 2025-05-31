import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestConfig, TestResult } from '../../shared/models/test.interface';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = 'http://localhost/api/db-api.php';

  constructor(private http: HttpClient) {}

  getTestConfig(testId: string): Observable<TestConfig> {
    return this.http.get<TestConfig>(`${this.apiUrl}?action=get_test_config&testId=${testId}`);
  }

  saveTestResult(result: TestResult): Observable<TestResult> {
    return this.http.post<TestResult>(`${this.apiUrl}?action=save_test_result`, result);
  }

  getTestResults(userId: string): Observable<TestResult[]> {
    return this.http.get<TestResult[]>(`${this.apiUrl}?action=get_test_results&userId=${userId}`);
  }
} 