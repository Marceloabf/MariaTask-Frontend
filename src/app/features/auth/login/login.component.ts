import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  user = {
    email: '',
    password: '',
  }
  loginError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.user.email && this.user.password) {
      this.authService.login(this.user).subscribe({
        next: (response) => {
          console.log(response)
          sessionStorage.setItem('access-token', response.access_token);
          console.log(sessionStorage)
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
}
