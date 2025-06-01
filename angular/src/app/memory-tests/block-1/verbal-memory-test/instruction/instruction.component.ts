import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InstructionComponent } from '../../../../shared/components/instruction/instruction.component';


@Component({
  selector: 'verbal-instruction',
  standalone: true,
  imports: [InstructionComponent],
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css']
})
export class VerbalInstructionComponent implements OnInit{
  private button: any;


  constructor(private router: Router) {}


  ngOnInit(): void{
    this.button = document.getElementById('nextButton');
    this.button.addEventListener('click', () => this.navigateToTrialStart());
  }


  navigateToTrialStart(){
    this.router.navigate(['/verbal-memory/trial/start']);
  }
}

