import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { VisualMemoryRoutingModule } from './visual-memory-routing.module';

// Components
import { VisualMemoryTestComponent } from './components/visual-memory-test.component';
import { VisualMemoryTrialComponent } from './components/visual-memory-trial.component';
import { VisualMemoryMainComponent } from './components/visual-memory-main.component';
import { VisualMemoryResultComponent } from './components/visual-memory-result.component';

@NgModule({
  declarations: [
    VisualMemoryTestComponent,
    VisualMemoryTrialComponent,
    VisualMemoryMainComponent,
    VisualMemoryResultComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    VisualMemoryRoutingModule
  ]
})
export class VisualMemoryModule { } 