import { AfterViewInit, Component, ElementRef, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle, InputTextModule, PasswordModule, DividerModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements AfterViewInit {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  loading = signal(false)
  validPass = signal({
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    lengthIsValid: false,
    hasSpecialChar: false,
  })

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    const meuBotao = this.elementRef.nativeElement.querySelector('#password');

    if (meuBotao) {
      meuBotao.addEventListener('keyup', () => {
        this.validatePass();
      });
    }
  }

  login() {
    this.loading.update(newValue => !newValue);
    this.validatePass()
    this.loading.update(newValue => !newValue);
  }

  validatePass() {
    const pass = (this.loginForm.get("password")?.value as string)

    const hasLowerCase = /[a-z]/.test(pass);
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const lengthIsValid = pass.length >= 8;
    const hasSpecialChar = /[!@#$%^&*]/.test(pass);

    this.validPass.update(newValue => ({
      ...newValue,
      hasLowerCase,
      hasUpperCase,
      hasNumber,
      lengthIsValid,
      hasSpecialChar
    }));
  }
}