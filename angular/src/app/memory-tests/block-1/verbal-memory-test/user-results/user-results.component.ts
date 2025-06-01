import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface TestResult {
  date: string;
  score: number;
  percent: number;
  level: string;
}

@Component({
  selector: 'app-user-results',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './user-results.component.html',
  styleUrls: ['./user-results.component.css']
})
export class UserResultsComponent implements OnInit {
  userData: any;
  userResults: TestResult[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  private readonly API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadUserResults();
  }

  loadUserData() {
    this.isLoading = true;
    this.error = null;
    
    this.http.get(`${this.API_URL}/db-api.php?action=user-data`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        console.log('User data response:', response);
        if (response && response.success) {
          this.userData = response.data;
        } else {
          this.error = response?.error || 'Ошибка загрузки данных пользователя';
          console.error('Ошибка загрузки данных пользователя:', response);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ошибка при загрузке данных пользователя:', error);
        this.error = 'Ошибка при загрузке данных пользователя';
        this.isLoading = false;
      }
    });
  }

  loadUserResults() {
    this.isLoading = true;
    this.error = null;
    
    this.http.get(`${this.API_URL}/db-api.php?action=user-results`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        console.log('User results response:', response);
        if (response && response.success) {
          this.userResults = response.data || [];
          console.log('Processed results:', this.userResults);
        } else {
          this.error = response?.error || 'Ошибка загрузки результатов';
          console.error('Ошибка загрузки результатов:', response);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ошибка при загрузке результатов:', error);
        this.error = 'Ошибка при загрузке результатов';
        this.isLoading = false;
      }
    });
  }

  deleteAccount() {
    if (confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.')) {
      this.isLoading = true;
      this.error = null;

      this.http.post(`${this.API_URL}/db-api.php?action=delete-account`, {}, { withCredentials: true }).subscribe({
        next: (response: any) => {
          if (response && response.success) {
            // Перенаправляем на страницу входа после успешного удаления
            this.router.navigate(['/verbal-memory/login']);
          } else {
            this.error = response?.error || 'Ошибка при удалении аккаунта';
            console.error('Ошибка при удалении аккаунта:', response);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Ошибка при удалении аккаунта:', error);
          this.error = 'Ошибка при удалении аккаунта';
          this.isLoading = false;
        }
      });
    }
  }
}
