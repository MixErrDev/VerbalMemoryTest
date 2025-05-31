import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TestState, TestConfig, TestResult } from '../models/test.interface';

@Component({
  template: ''
})
export abstract class BaseTestComponent implements OnInit, OnDestroy {
  protected testState: TestState = {
    isComplete: false,
    score: 0,
    timeSpent: 0,
    errors: 0,
    correctAnswers: 0,
    totalQuestions: 0
  };

  protected testConfig: TestConfig;
  protected timer: any;
  protected startTime: number;

  constructor(protected router: Router) {}

  ngOnInit(): void {
    this.initializeTest();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  protected initializeTest(): void {
    this.startTime = Date.now();
    this.testState = {
      isComplete: false,
      score: 0,
      timeSpent: 0,
      errors: 0,
      correctAnswers: 0,
      totalQuestions: 0
    };
  }

  protected startTimer(): void {
    this.timer = setInterval(() => {
      this.testState.timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
    }, 1000);
  }

  protected stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  protected calculateResults(): void {
    this.testState.score = (this.testState.correctAnswers / this.testState.totalQuestions) * 100;
    this.testState.isComplete = true;
  }

  protected saveResults(): void {
    const result: TestResult = {
      testId: this.constructor.name,
      userId: 'current-user', // TODO: Implement user service
      timestamp: new Date(),
      state: this.testState,
      config: this.testConfig
    };
    // TODO: Implement result service
    console.log('Test results:', result);
  }

  protected cleanup(): void {
    this.stopTimer();
  }

  protected navigateToResults(): void {
    this.router.navigate(['/result']);
  }
} 