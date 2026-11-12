import { Component, HostListener, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../user.service';
import { passValidation } from '../../models/passValidation.model';
import { User } from '../../models/user.model';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth-service.service';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, DividerModule, ButtonModule, ToastModule, RouterLink, AuthLayoutComponent],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  validPassTips = signal<passValidation>({
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    lengthIsValid: false,
    hasSpecialChar: false,
  });
  loading = signal(false);
  fb = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.minLength(1)]),
    password: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  constructor(
    private authService: AuthService,
    private validateUserService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  login(provider?: string): void {
    if (this.fb.valid) {
      this.loading.update(newValue => !newValue);
      this.validateUserService.validateLogin(provider).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success!', detail: response.message });

          this.authService.setAuthToken(response.token);
          this.loading.update(newValue => !newValue);
          setTimeout(() => {
            this.router.navigate(["/mainTable"])
          }, 500);
        },
        error: (err) => {
          if (err.status != 500) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.statusText });
          }
          this.loading.update(newValue => !newValue);
          return err
        },
      });
    } else {
      this.fb.markAllAsTouched();
    }
  }

  loginWithProvider(provider: string): void {
    const width = 500;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      `http://localhost:8000/api/auth/login?provider=${encodeURIComponent(provider)}`,
      'oauth-login',
      `popup=yes,width=${width},height=${height},left=${left},top=${top}`
    );
  }

  @HostListener('window:message', ['$event'])
  onMessage(e: MessageEvent) {
    if (e.origin !== window.location.origin) return; 
    if (e.data?.type === 'oauth-success') this.router.navigate(['/mainTable']);
    if (e.data?.type === 'oauth-error') this.messageService.add(
      { severity: 'error', summary: 'Error', detail: e.data.error });
  }

  // getUserData(): User {
  //   const user = {
  //     email: this.fb.get("email")!.value as string,
  //     password: this.fb.get("password")!.value as string
  //   }

  //   return user
  // }
}