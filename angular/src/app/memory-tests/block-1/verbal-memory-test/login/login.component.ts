import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  showPassword = false;
  isLoading: boolean = false;
  private readonly API_URL = 'http://localhost:3000';
  private readonly LOGIN_URL = `${this.API_URL}/db-api.php?action=login`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { email, password } = this.loginForm.value;
    const apiUrl = this.LOGIN_URL;

    this.http.post(apiUrl, { email, password }, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.success) {
          this.successMessage = 'Вход выполнен успешно!';
          console.log('Login successful:', response);
          setTimeout(() => {
            this.router.navigate(['verbal-memory/user-results']);
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Неизвестная ошибка входа.';
          console.error('Login failed:', response);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Ошибка при выполнении входа.';
        console.error('Login error:', error);
      }
    });
  }

  goToRegistration() {
    this.router.navigate(['/verbal-memory/registration']);
  }
}
