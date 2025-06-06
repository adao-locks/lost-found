import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    standalone: false
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  onLogin() {
    const usuarios = [
      {
        email: 'admin@example.com',
        senha: 'admin123',
        nome: 'João Silva',
        tipo: 'admin'
      },
      {
        email: 'colaborador@example.com',
        senha: 'colab123',
        nome: 'Ana Costa',
        tipo: 'colaborador'
      }
    ];
    const usuario = usuarios.find(
      u => u.email === this.email && u.senha === this.password
    );

    if (usuario) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'E-mail ou senha inválidos';
    }
    localStorage.setItem('usuarioLogado', JSON.stringify({
      nome: 'João Silva',
      tipo: 'admin'
    }));
  }
}
