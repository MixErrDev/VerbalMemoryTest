export interface TestState {
  isComplete: boolean;
  score: number;
  timeSpent: number;
  errors: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface TestComponent {
  startTest(): void;
  endTest(): void;
  calculateResults(): void;
  saveResults(): void;
}

export interface TestConfig {
  trialDuration: number;
  mainDuration: number;
  maxErrors: number;
  minScore: number;
}

export interface TestResult {
  testId: string;
  userId: string;
  timestamp: Date;
  state: TestState;
  config: TestConfig;
} 