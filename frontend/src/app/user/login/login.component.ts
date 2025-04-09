import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../user.service';
import { passValidation } from '../../models/passValidation.model';
import { User } from '../../models/user.model';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, DividerModule, ButtonModule, ToastModule, RouterLink, RouterLinkActive],
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
    private validateUserService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  login(): void {
    if (this.fb.valid) {
      this.loading.update(newValue => !newValue);
      this.validateUserService.validateLogin(this.getUserData()).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success!', detail: response.message });

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
    }
  }

  getUserData(): User {
    const user = {
      email: this.fb.get("email")!.value as string,
      password: this.fb.get("password")!.value as string
    }

    return user
  }
}