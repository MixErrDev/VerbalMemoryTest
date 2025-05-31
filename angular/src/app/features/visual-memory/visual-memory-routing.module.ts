import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualMemoryTestComponent } from './components/visual-memory-test.component';
import { VisualMemoryTrialComponent } from './components/visual-memory-trial.component';
import { VisualMemoryMainComponent } from './components/visual-memory-main.component';
import { VisualMemoryResultComponent } from './components/visual-memory-result.component';

const routes: Routes = [
  {
    path: '',
    component: VisualMemoryTestComponent,
    children: [
      { path: 'trial', component: VisualMemoryTrialComponent },
      { path: 'main', component: VisualMemoryMainComponent },
      { path: 'result', component: VisualMemoryResultComponent },
      { path: '', redirectTo: 'trial', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisualMemoryRoutingModule { } 