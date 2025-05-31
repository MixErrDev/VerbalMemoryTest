import { RouteConfigLoadEnd, Routes } from '@angular/router';

import { AssetsComponent } from './AssetsWork/assets.component';

import { VerbalInstructionComponent } from './memory-tests/block-1/verbal-memory-test/instruction/instruction.component';
import { VerbalResultComponent } from './memory-tests/block-1/verbal-memory-test/result/result.component';
import { TrialStartComponent } from './memory-tests/block-1/verbal-memory-test/trial-start/trial-start.component';
import { TrialProcessComponent } from './memory-tests/block-1/verbal-memory-test/trial-process/trial-process.component';
import { MainStartComponent } from './memory-tests/block-1/verbal-memory-test/main-start/main-start.component';
import { MainProcessComponent } from './memory-tests/block-1/verbal-memory-test/main-process/main-process.component';
import { RegistrationComponent } from './memory-tests/block-1/verbal-memory-test/registration/registration.component';
import { LoginComponent } from './memory-tests/block-1/verbal-memory-test/login/login.component';
import { UserResultsComponent } from './memory-tests/block-1/verbal-memory-test/user-results/user-results.component';

export const verbalTestRoutes: Routes = [
    {path: '', component: VerbalInstructionComponent},
    {
        path: 'trial',
        children: [
            {path: 'start', component: TrialStartComponent},
            {path: 'process', component: TrialProcessComponent}
        ]
    },
    {
        path: 'main',
        children: [
            {path: 'start', component: MainStartComponent},
            {path: 'process', component: MainProcessComponent}
        ]
    },
    {path: 'result', component: VerbalResultComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registration', component: RegistrationComponent},
    {path: 'user-results', component: UserResultsComponent}
];

export const routes: Routes = [
    {
        path: 'verbal-memory',
        children: verbalTestRoutes
    },
    {
        path: 'assets',
        component: AssetsComponent
    },
    {
        path: '',
        redirectTo: 'verbal-memory',
        pathMatch: 'full'
    }
];
