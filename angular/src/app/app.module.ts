import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'visual-memory',
    loadChildren: () => import('./features/visual-memory/visual-memory.module').then(m => m.VisualMemoryModule)
  },
  {
    path: '',
    redirectTo: 'visual-memory',
    pathMatch: 'full' as const
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    CoreModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 