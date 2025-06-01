import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserResultsComponent } from './user-results/user-results.component';

const routes: Routes = [
  { path: 'verbal-memory/user-results', component: UserResultsComponent },
  // Другие маршруты...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {} 