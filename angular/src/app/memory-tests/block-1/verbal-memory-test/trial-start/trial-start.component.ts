import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'verbal-trial-start',
  standalone: true,
  imports: [],
  templateUrl: './trial-startRu.component.html',
})
export class TrialStartComponent {

  constructor(private router: Router) {}

  navigateToTrialProcess(){
    console.log('click');
    this.router.navigate(['/verbal-memory/trial/process']);
  }

  goBack() {
    this.router.navigate(['/verbal-memory']);
  }

  skipTrialProcess(){
    console.log("Skipping trial task");
    this.router.navigate(['/verbal-memory/main/start']);
  }
}
