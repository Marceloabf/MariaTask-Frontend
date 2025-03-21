import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DividerModule, InputTextModule, FloatLabelModule, PasswordModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  user = {
    email: '',
    password: '',
  }
  newUser = {
    name: '',
    email: '',
    password: '',
  }
  loginError: string = '';

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {}

  login() {
    if (this.user.email && this.user.password) {
      this.authService.login(this.user).subscribe({
        next: (response) => {
          sessionStorage.setItem('access-token', response.access_token);
          this.router.navigate(['/tasks']);
          this.authService.setUserId(response.userId)
        },
        error: (error: Error) => {
          console.error('Erro ao logar:', error)
          this.loginError = 'Credenciais inválidas. Tente novamente.';
        }
      });
    } else {
      this.loginError = 'Por favor, preencha todos os campos.';
    }
  }

  register(){
    if (!this.newUser.email || !this.newUser.password) return;
    this.authService.register(this.newUser).subscribe({
      next: () => this.messageService.add({ severity: 'success', summary: 'Criado', detail: 'Usuário criado com sucesso' }),
      error: (error: Error)=>{
        console.error('Erro ao cadastrar usuário:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao criar usuário' })
      }
    })
  }
}
