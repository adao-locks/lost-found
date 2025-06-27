import { Component } from '@angular/core';
import { Auth, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  usuarioLogado = { nome: '', tipo: 'usuário' };
  private auth: Auth = inject(Auth);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuarioStr = localStorage.getItem('usuarioLogado');
    if (usuarioStr) {
      this.usuarioLogado = JSON.parse(usuarioStr);
      document.body.classList.toggle('admin', this.usuarioLogado.tipo === 'admin');
    }

    // Monitorar o estado do Firebase Auth (opcional, mas útil)
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (!user) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('usuarioLogado');
        this.router.navigate(['/login']);
      }
    });
  }

  async logout() {
    await signOut(this.auth);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/']);
  }
}
