import { AfterViewInit, Component, ElementRef, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { NgStyle } from '@angular/common';
import { LoginService } from './login.service';
import { passValidation } from '../models/passValidation.model';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle, InputTextModule, PasswordModule, DividerModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements AfterViewInit {
  validPassTips = signal<passValidation>({
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    lengthIsValid: false,
    hasSpecialChar: false,
  });
  loading = signal(false);
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(1)]),
    password: new FormControl('', this.validPass()),
  });

  constructor(
    private elementRef: ElementRef,
    private validateLoginService: LoginService,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    const meuBotao = this.elementRef.nativeElement.querySelector('#password');

    if (meuBotao) {
      meuBotao.addEventListener('keyup', () => {
        this.validatePassTips();
      });
    }
  }

  validLoginFields(): void {
    if (this.loginForm.get("password")?.value && this.loginForm.get("username")?.value) this.login();
  }

  login(): void {
    this.loading.update(newValue => !newValue);
    let valid = false

    if (this.loginForm.valid) {
      valid = this.validateLoginService.validateLogin(this.getUserData());
    }
    if (valid) this.router.navigate(["/mainTable"])
    this.loading.update(newValue => !newValue);
  }

  getUserData(): User {
    const user = {
      username: this.loginForm.get("username")!.value as string,
      password: this.loginForm.get("password")!.value as string
    }

    return user
  }

  validatePassTips() {
    const pass = this.loginForm.get("password")?.value as string

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

  validPass(): ValidationErrors | null {
    const validPassCriterias: passValidation = this.validPassTips();
    const keys = Object.keys(validPassCriterias);
    for (let index = 0; index < keys.length; index++) {
      if (!validPassCriterias[keys[index]]) return { passValidation: true }
    }
    return null
  }
}