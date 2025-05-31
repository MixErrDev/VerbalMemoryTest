import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instruction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instruction.component.html'
})
export class InstructionComponent {
  @Input() title: string;
  @Input() instructions: any[];
  @Input() route: string;
}
