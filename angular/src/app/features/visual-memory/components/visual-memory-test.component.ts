import { Component, OnInit } from '@angular/core';
import { TestService } from '../../../core/services/test.service';
import { TestConfig } from '../../../shared/models/test.interface';

@Component({
  selector: 'app-visual-memory-test',
  template: `
    <div class="test-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .test-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
  `]
})
export class VisualMemoryTestComponent implements OnInit {
  testConfig: TestConfig;

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.loadTestConfig();
  }

  private loadTestConfig(): void {
    this.testService.getTestConfig('visual-memory-test').subscribe(
      config => {
        this.testConfig = config;
      },
      error => {
        console.error('Error loading test config:', error);
      }
    );
  }
} 