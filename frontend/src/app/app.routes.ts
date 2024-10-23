import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'user/login', pathMatch: 'full' },
    { path: 'user', loadChildren: () => import('./user/routes').then(mod => mod.USER_ROUTES) },
    { path: 'mainTable', loadChildren: () => import('./main-table/routes').then(mod => mod.TABLE_ROUTES) },
    { path: '**', redirectTo: '' }
];
