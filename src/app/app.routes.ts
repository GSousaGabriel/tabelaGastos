import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '', loadChildren: () => import('./login/routes').then(mod => mod.LOGIN_ROUTES) },
    { path: '**', redirectTo: '' }
];
