import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'verbal-main-start',
  standalone: true,
  imports: [],
  templateUrl: './main-startRu.component.html',
})
export class MainStartComponent {
  constructor(private router: Router) {}

  navigateToMainProcess(){
    console.log('click');
    this.router.navigate(['/verbal-memory/main/process']);
  }

  goBack() {
    this.router.navigate(['/verbal-memory/trial/start']);
  }
}
