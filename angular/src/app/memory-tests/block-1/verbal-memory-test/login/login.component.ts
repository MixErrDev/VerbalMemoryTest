import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private button: any;


  constructor(private router: Router) {}


  ngOnInit(): void{
    this.button = document.getElementById('registrationButton');
    this.button.addEventListener('click', () => this.navigateToRegistration());
  }


  navigateToRegistration(){
    this.router.navigate(['/registration']);
  }
}
