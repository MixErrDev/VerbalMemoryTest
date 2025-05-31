import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  verificationForm: FormGroup;
  showVerification = false;
  emailSent = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  private readonly API_URL = 'http://localhost:3000';
  private readonly SEND_VERIFICATION_URL = `${this.API_URL}/send-verification.php`;
  private readonly VERIFY_CODE_URL = `${this.API_URL}/verify-code.php`;
  private readonly REGISTER_URL = `${this.API_URL}/db-api.php?action=register`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(9),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{9,}$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      username: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    this.verificationForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]]
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  togglePasswordVisibility(input: HTMLInputElement) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  async onSubmit() {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        console.log('Sending verification code to:', this.registrationForm.get('email')?.value);
        const response = await this.http.post(this.SEND_VERIFICATION_URL, {
          email: this.registrationForm.get('email')?.value
        }).toPromise();
        
        console.log('Verification response:', response);
        
        if (response && (response as any).success) {
          this.showVerification = true;
          this.emailSent = true;
          this.errorMessage = '';
          if ((response as any).debug?.code) {
            this.successMessage = `Код подтверждения: ${(response as any).debug.code}`;
          }
        } else {
          const errorMsg = (response as any)?.error || 'Ошибка отправки кода подтверждения';
          this.errorMessage = errorMsg;
          console.error('Verification error:', response);
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        this.errorMessage = error.error?.error || 'Ошибка отправки кода подтверждения';
      } finally {
        this.isLoading = false;
      }
    }
  }

  async verifyCode() {
    if (this.verificationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        console.log('Verifying code for:', this.registrationForm.get('email')?.value);
        const response = await this.http.post(this.VERIFY_CODE_URL, {
          email: this.registrationForm.get('email')?.value,
          code: this.verificationForm.get('code')?.value
        }).toPromise();

        console.log('Verification response:', response);

        if (response && (response as any).success) {
          // Register user after successful verification
          console.log('Registering user...');
          const registerResponse = await this.http.post(this.REGISTER_URL, {
            email: this.registrationForm.get('email')?.value,
            username: this.registrationForm.get('username')?.value,
            password: this.registrationForm.get('password')?.value,
            age: this.registrationForm.get('age')?.value,
            gender: this.registrationForm.get('gender')?.value
          }).toPromise();

          console.log('Registration response:', registerResponse);

          if (registerResponse && (registerResponse as any).success) {
            this.successMessage = 'Регистрация успешна! Перенаправление на страницу входа...';
            this.errorMessage = '';
            
            // Wait for 2 seconds to show the success message before redirecting
            setTimeout(() => {
              this.router.navigate(['/verbal-memory/login']);
            }, 2000);
          } else {
            const errorMsg = (registerResponse as any)?.error || 'Ошибка регистрации';
            this.errorMessage = errorMsg;
            console.error('Registration error:', registerResponse);
          }
        } else {
          const errorMsg = (response as any)?.error || 'Неверный код подтверждения';
          this.errorMessage = errorMsg;
          console.error('Verification error:', response);
        }
      } catch (error: any) {
        console.error('Error:', error);
        this.errorMessage = error.error?.error || 'Ошибка верификации';
      } finally {
        this.isLoading = false;
      }
    }
  }
}
