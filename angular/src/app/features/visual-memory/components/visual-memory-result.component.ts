import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestService } from '../../../core/services/test.service';
import { TestResult } from '../../../shared/models/test.interface';

@Component({
  selector: 'app-visual-memory-result',
  template: `
    <div class="result-container">
      <h2>Test Results</h2>
      <div class="result-content" *ngIf="testResult">
        <div class="result-item">
          <span class="label">Total Score:</span>
          <span class="value">{{testResult.state.score}}%</span>
        </div>
        <div class="result-item">
          <span class="label">Time Spent:</span>
          <span class="value">{{testResult.state.timeSpent}} sec</span>
        </div>
        <div class="result-item">
          <span class="label">Correct Answers:</span>
          <span class="value">{{testResult.state.correctAnswers}} out of {{testResult.state.totalQuestions}}</span>
        </div>
        <div class="result-item">
          <span class="label">Errors:</span>
          <span class="value">{{testResult.state.errors}}</span>
        </div>
      </div>
      <div class="controls">
        <button (click)="navigateToHome()">Return to Home</button>
      </div>
    </div>
  `,
  styles: [`
    .result-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .result-content {
      margin: 20px 0;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .result-item {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    .label {
      font-weight: bold;
    }
    .controls {
      text-align: center;
      margin-top: 20px;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
  `]
})
export class VisualMemoryResultComponent implements OnInit {
  testResult: TestResult;

  constructor(
    private router: Router,
    private testService: TestService
  ) {}

  ngOnInit(): void {
    this.loadTestResult();
  }

  private loadTestResult(): void {
    // In a real application, this would load the latest test result
    this.testResult = {
      testId: 'visual-memory-test',
      userId: 'current-user',
      timestamp: new Date(),
      state: {
        isComplete: true,
        score: 85,
        timeSpent: 120,
        errors: 3,
        correctAnswers: 17,
        totalQuestions: 20
      },
      config: {
        trialDuration: 60,
        mainDuration: 120,
        maxErrors: 5,
        minScore: 70
      }
    };
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
} 