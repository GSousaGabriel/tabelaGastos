import { Routes } from '@angular/router';
import { authenticationGuardGuard } from './guards/authentication-guard.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'user/login', pathMatch: 'full' },
    { path: 'user', loadChildren: () => import('./user/routes').then(mod => mod.USER_ROUTES) },
    { path: 'mainTable', canActivate: [authenticationGuardGuard], loadChildren: () => import('./main-table/routes').then(mod => mod.TABLE_ROUTES) },
    { path: '**', redirectTo: '' }
];
