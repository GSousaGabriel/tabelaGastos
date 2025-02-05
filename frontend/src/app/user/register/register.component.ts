import { Component, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MessageService } from 'primeng/api';
import { passValidation } from '../../models/passValidation.model';
import { User } from '../../models/user.model';
import { NgStyle } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle, InputTextModule, PasswordModule, DividerModule, ButtonModule, ToastModule, RouterLink, RouterLinkActive],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  validPassTips = signal<passValidation>({
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    lengthIsValid: false,
    hasSpecialChar: false,
  });
  loading = signal(false);
  fb = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.minLength(1), Validators.email]),
    password: new FormControl('', [this.validPass.bind(this)]),
  });

  constructor(
    private validateUserService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  register(): void {
    if (this.fb.valid) {
      this.loading.update(newValue => !newValue);
      this.validateUserService.registerUser(this.getUserData()).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Registered', detail: response.message });
          this.loading.update(newValue => !newValue);
          setTimeout(() => {
            this.router.navigate(["/user/login"])
          }, 500);
        },
        error: (err) => {
          if (err.status == 409) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "User already registered!" });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.statusText });
          }
          this.loading.update(newValue => !newValue);
          return err
        },
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Invalid fields', detail: "Please, fill all fields before registering." });
    }
  }

  getUserData(): User {
    const user = {
      email: this.fb.get("email")!.value as string,
      password: this.fb.get("password")!.value as string
    }

    return user
  }

  validatePassTips(pass: string) {
    const hasLowerCase = /[a-z]/.test(pass);
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const lengthIsValid = pass.length >= 8;
    const hasSpecialChar = /[!@#$%^&*]/.test(pass);

    this.validPassTips.update(newValue => ({
      ...newValue,
      hasLowerCase,
      hasUpperCase,
      hasNumber,
      lengthIsValid,
      hasSpecialChar
    }));
  }

  validPass(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    this.validatePassTips(value)

    if (!value) {
      return null;
    }

    const validPassCriterias: passValidation = this.validPassTips();
    const keys = Object.keys(validPassCriterias);
    for (let index = 0; index < keys.length; index++) {
      if (!validPassCriterias[keys[index]]) return { passValidation: true }
    }

    return null;
  }
}
