import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  usuarioLogado: any;

  ngOnInit(): void {
    const usuarioStr = localStorage.getItem('usuarioLogado');
    this.usuarioLogado = usuarioStr ? JSON.parse(usuarioStr) : { tipo: 'visitante' };
  }
}
