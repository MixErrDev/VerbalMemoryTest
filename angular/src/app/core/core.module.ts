import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Сервисы импортируются напрямую, так как они уже зарегистрированы с providedIn: 'root'
// import { TestService } from './services/test.service';
// import { UserService } from './services/user.service';
// import { ResultService } from './services/result.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    // Сервисы уже зарегистрированы с providedIn: 'root', поэтому их не нужно добавлять в providers
    // TestService,
    // UserService,
    // ResultService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
} 