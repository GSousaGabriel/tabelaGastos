import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadChildren: () => import('./login/routes').then(mod => mod.LOGIN_ROUTES) },
    { path: 'mainTable', loadChildren: () => import('./main-table/routes').then(mod => mod.TABLE_ROUTES) },
    { path: '**', redirectTo: '' }
];
