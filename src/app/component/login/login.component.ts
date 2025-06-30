import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  private auth: Auth = inject(Auth);

  constructor(private router: Router) {}

  async onLogin() {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;

      // Se quiser armazenar dados adicionais, crie lógica para buscá-los do Firestore
      const usuario = {
        email: user.email,
        nome: user.displayName || user.email,
        tipo: user.email === 'admin@example.com' ? 'admin' : 'usuário'
      };

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.errorMessage = 'E-mail ou senha inválidos';
    }
  }

  async loginComoColaborador() {
    this.email = 'colaborador@example.com';
    this.password = 'colab123';
    await this.onLogin();
  }
}
