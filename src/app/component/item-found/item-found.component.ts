import { Component } from '@angular/core';

@Component({
  selector: 'app-item-found',
  standalone: false,
  templateUrl: './item-found.component.html',
  styleUrl: './item-found.component.css'
})
export class ItemFoundComponent {
  itensEncontrados: any[] = [];

  ngOnInit(): void {
    const itens = JSON.parse(localStorage.getItem('itens') || '[]');
    this.itensEncontrados = itens.filter((i: any) => i.status === 'disponivel');
  }
}
