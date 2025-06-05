import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Item {
  nome: string;
  local: string;
  data: string;
  status: 'disponivel' | 'devolvido' | 'descartado';
}

interface Reivindicacao {
  usuario: string;
  item: string;
  status: 'pendente' | 'aprovado' | 'recusado';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userName = '';

  constructor(private router: Router) {}

  itens: Item[] = [];
  reivindicacoes: Reivindicacao[] = [];
  usuarioLogado: { nome: string; tipo: 'admin' | 'colaborador' } = { nome: '', tipo: 'colaborador' };

  stats = {
    total: 0,
    disponiveis: 0,
    devolvidos: 0,
    reivindicacoes: 0
  };

  itensRecentes: Item[] = [];
  reivindicacoesPendentes: Reivindicacao[] = [];

  ngOnInit(): void {
    this.usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{"nome": "Visitante", "tipo": "colaborador"}');

    this.itens = [
      { nome: 'Carteira de couro', local: 'Biblioteca Central', data: '2024-01-15', status: 'disponivel' },
      { nome: 'Óculos de sol', local: 'Cantina', data: '2024-01-14', status: 'disponivel' },
      { nome: 'Chaves do carro', local: 'Estacionamento', data: '2024-01-13', status: 'devolvido' },
      { nome: 'Celular Samsung', local: 'Sala 201', data: '2024-01-12', status: 'descartado' }
    ];

    this.reivindicacoes = [
      { usuario: 'Maria Santos', item: 'Carteira de couro', status: 'pendente' },
      { usuario: 'Pedro Costa', item: 'Celular Samsung', status: 'pendente' },
      { usuario: 'Joana Lima', item: 'Chaves do carro', status: 'aprovado' }
    ];

    this.calcularEstatisticas();
    this.carregarItensRecentes();
    this.carregarReivindicacoesPendentes();
  }

  calcularEstatisticas() {
    this.stats.total = this.itens.length;
    this.stats.disponiveis = this.itens.filter(i => i.status === 'disponivel').length;
    this.stats.devolvidos = this.itens.filter(i => i.status === 'devolvido').length;
    this.stats.reivindicacoes = this.reivindicacoes.filter(r => r.status === 'pendente').length;
  }

  carregarItensRecentes() {
    this.itensRecentes = [...this.itens]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 4);
  }

  carregarReivindicacoesPendentes() {
    this.reivindicacoesPendentes = this.reivindicacoes.filter(r => r.status === 'pendente');
  }

  logout() {
    localStorage.clear();
    window.location.href = '/';
  }
}
