import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OauthDoneComponent } from './oauth-done/oauth-done.component';

export const USER_ROUTES: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'oauth-done', component: OauthDoneComponent}
];
