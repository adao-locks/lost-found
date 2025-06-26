import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  usuarioLogado = { nome: '', tipo: 'usuário' };

  ngOnInit(): void {
    const usuarioStr = localStorage.getItem('usuarioLogado');
    if (usuarioStr) {
      this.usuarioLogado = JSON.parse(usuarioStr);
      document.body.classList.toggle('admin', this.usuarioLogado.tipo === 'admin');
    }
  }

  //localStorage.clear(); limpa o localStorage
  logout() {
    window.location.href = '/';
  }
}

