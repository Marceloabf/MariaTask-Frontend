import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    ToastModule,
    DialogModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  user = {
    email: '',
    password: '',
  };
  newUser = {
    name: '',
    email: '',
    password: '',
    passwordClone: '',
  };
  visibleDialog: boolean = false;
  isRegister: boolean = false;
  isLoadingLogin: boolean = false;
  isLoadingRegister: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  login() {
    if (!this.user.email || !this.user.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Verify',
        detail: 'Fields: Email and Password are required!',
      });
      return;
    }
    if (!this.validateEmail(this.user.email)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Verify',
        detail: 'Invalid email format',
      });
      return;
    }
    
    this.isLoadingLogin = true;
    this.authService.login(this.user).subscribe({
      next: (response) => {
        this.isLoadingLogin = false;
        sessionStorage.setItem('access-token', response.access_token);
        sessionStorage.setItem('user-id', JSON.stringify(response.userId));
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        if (error.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error.error.message,
          });
        } else{
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'User login failed',
          });
        }
        this.isLoadingLogin = false;
      },
    });
  }

  register() {
    if (!this.validateEmail(this.newUser.email)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Verify',
        detail: 'Invalid email format',
      });
      return;
    }
    
    if (this.newUser.password !== this.newUser.passwordClone) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Verify',
        detail: `Passwords don't match`,
      });
      return;
    }
    
    if (!this.validatePassword(this.newUser.password)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Verify',
        detail: `Password too weak`,
      });
      return;
    }
    
    this.isLoadingRegister = true;
    this.authService.register(this.newUser).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Created',
          detail: 'User created with success',
        }),
        this.isRegister = false;
        this.isLoadingRegister = false;
      },
      error: (error) => {
        console.error('User creation failed:', error);
        if (error.status === 409) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error.error.message,
          });
        } else{
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'User Creation Failed',
          });
        }
        this.isLoadingRegister = false;
      },
      complete: () => {
        this.newUser = {
          name: '',
          email: '',
          password: '',
          passwordClone: '',
        };
      },
    });
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  validatePassword(password: string): boolean {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    return passwordPattern.test(password);
  }

  toggleDialog() {
    this.visibleDialog = !this.visibleDialog;
  }

  toggleRegister() {
    this.isRegister = !this.isRegister;
  }
}
