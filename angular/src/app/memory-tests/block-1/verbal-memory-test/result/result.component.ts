import { Component, OnInit, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { PointsService } from '../../../../services/points.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verbal-result',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class VerbalResultComponent implements OnInit {
  points: number = 0;
  percent: number;
  level: string;
  text: string;
  isSaving: boolean = false;
  saveError: string | null = null;
  private readonly API_URL = 'http://localhost:3000';

  constructor(
    private router: Router,
    private pointsService: PointsService,
    private http: HttpClient,
    @Inject(DOCUMENT) private _document
  ) {}

  ngOnInit(): void {
    this.points = this.pointsService.getPoints();
    console.log(this.points);
    this.pointsService.setPoints(0);
    this.percent = this.calculatePerсent(this.points);
    this.level = this.setLevel(this.points);
    this.text = this.setText(this.points)
  }

  calculatePerсent(points) {
    return Math.round((points / 19) * 100);
  }

  setLevel(points) {
    if(0 <= points && points <= 7) {
      return('Низкий уровень');
    }else if (8 <= points && points <= 13) {
      return('Средний уровень');
    }else if (14 <= points && points <= 19) {
      return('Высокий уровень');
    }
    return 'Неизвестный уровень';
  }

  setText(points) {
    if(0 <= points && points <= 7) {
      return('Ваш результат указывает на низкий уровень вербальной памяти. Рекомендуется регулярно тренировать память с помощью специальных упражнений и техник.');
    }else if (8 <= points && points <= 13) {
      return('Ваш результат указывает на средний уровень вербальной памяти. Продолжайте тренировать память для достижения лучших результатов.');
    }else if (14 <= points && points <= 19) {
      return('Ваш результат указывает на высокий уровень вербальной памяти. Продолжайте поддерживать и развивать свои способности.');
    }
    return 'Не удалось определить уровень вербальной памяти.';
  }

  saveResult() {
    this.isSaving = true;
    this.saveError = null;

    if (this.points === undefined || this.points === null) {
      this.saveError = 'Ошибка: результат не определен';
      this.isSaving = false;
      return;
    }

    if (this.percent === undefined || this.percent === null) {
      this.saveError = 'Ошибка: процент не определен';
      this.isSaving = false;
      return;
    }

    if (!this.level) {
      this.saveError = 'Ошибка: уровень не определен';
      this.isSaving = false;
      return;
    }

    const resultData = {
      score: Number(this.points),
      percent: Number(this.percent),
      level: String(this.level)
    };

    console.log('Saving result:', resultData);

    this.http.post(`${this.API_URL}/db-api.php?action=save_test_result`, resultData, { 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).subscribe({
      next: (response: any) => {
        console.log('Response:', response);
        if (response && response.success) {
          this.router.navigate(['/verbal-memory/user-results']);
        } else {
          this.saveError = response?.error || 'Ошибка при сохранении результата';
          console.error('Ошибка при сохранении результата:', response);
        }
        this.isSaving = false;
      },
      error: (error) => {
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });
        
        let errorMessage = 'Ошибка при сохранении результата';
        if (error.error) {
          if (typeof error.error === 'object') {
            errorMessage = error.error.error || errorMessage;
          } else if (typeof error.error === 'string') {
            try {
              const parsedError = JSON.parse(error.error);
              errorMessage = parsedError.error || errorMessage;
            } catch (e) {
              errorMessage = error.error;
            }
          }
        }
        
        this.saveError = errorMessage;
        this.isSaving = false;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/verbal-memory/login']);
  }

  backBtnRouter() {
    this.router.navigate(['/verbal-memory']);
  }
}
