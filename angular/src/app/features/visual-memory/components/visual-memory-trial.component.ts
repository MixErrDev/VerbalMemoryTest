import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseTestComponent } from '../../../shared/components/base-test.component';
import { TestService } from '../../../core/services/test.service';

@Component({
  selector: 'app-visual-memory-trial',
  template: `
    <div class="trial-container">
      <h2>Пробный этап теста</h2>
      <div class="test-content">
        <!-- Здесь будет содержимое теста -->
      </div>
      <div class="controls">
        <button (click)="startTest()" [disabled]="isTestStarted">Начать</button>
        <button (click)="endTest()" [disabled]="!isTestStarted">Завершить</button>
      </div>
    </div>
  `,
  styles: [`
    .trial-container {
      text-align: center;
    }
    .test-content {
      margin: 20px 0;
      min-height: 300px;
    }
    .controls {
      display: flex;
      justify-content: center;
      gap: 10px;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
    button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  `]
})
export class VisualMemoryTrialComponent extends BaseTestComponent implements OnInit {
  isTestStarted = false;

  constructor(
    protected override router: Router,
    private testService: TestService
  ) {
    super(router);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  startTest(): void {
    this.isTestStarted = true;
    this.startTimer();
    // Здесь будет логика начала теста
  }

  endTest(): void {
    this.isTestStarted = false;
    this.stopTimer();
    this.calculateResults();
    this.saveResults();
    this.router.navigate(['/visual-memory/main']);
  }
} 