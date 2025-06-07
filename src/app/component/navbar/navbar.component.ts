import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  usuarioLogado = { nome: '', tipo: 'colaborador' };

  ngOnInit(): void {
    const usuarioStr = localStorage.getItem('usuarioLogado');
    if (usuarioStr) {
      this.usuarioLogado = JSON.parse(usuarioStr);
      document.body.classList.toggle('admin', this.usuarioLogado.tipo === 'admin');
    }
  }

  logout() {
      localStorage.clear();
      window.location.href = '/';
  }
}

