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
    styleUrl: './dashboard.component.css',
    standalone: false
})
export class DashboardComponent {
  usuarioLogado = { nome: '', tipo: 'colaborador' };
  itens: Item[] = [];
  itensRecentes: Item[] = [];
  reivindicacoes: Reivindicacao[] = [];
  reivindicacoesPendentes: Reivindicacao[] = [];
  stats = {
    total: 0,
    disponiveis: 0,
    devolvidos: 0,
    reivindicacoes: 0
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuarioStr = localStorage.getItem('usuarioLogado');
    if (usuarioStr) {
      this.usuarioLogado = JSON.parse(usuarioStr);
      document.body.classList.toggle('admin', this.usuarioLogado.tipo === 'admin');
    }

    const itensSalvos = localStorage.getItem('itens');
    this.itens = itensSalvos ? JSON.parse(itensSalvos) : [];

    const reivSalvas = localStorage.getItem('reivindicacoes');
    this.reivindicacoes = reivSalvas ? JSON.parse(reivSalvas) : [];

    this.calcularEstatisticas();
    this.carregarItensRecentes();
    this.carregarReivindicacoesPendentes();
  }

  carregarItensRecentes() {
    this.itensRecentes = [...this.itens]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 4);
  }

  carregarReivindicacoesPendentes() {
    this.reivindicacoesPendentes = this.reivindicacoes.filter(r => r.status === 'pendente');
  }

  calcularEstatisticas() {
    this.stats.total = this.itens.length;
    this.stats.disponiveis = this.itens.filter(i => i.status === 'disponivel').length;
    this.stats.devolvidos = this.itens.filter(i => i.status === 'devolvido').length;
    this.stats.reivindicacoes = this.reivindicacoes.filter(r => r.status === 'pendente').length;
  }

  aprovarReivindicacao(reivindicacao: any) {
    reivindicacao.status = 'aprovado';

    const item = this.itens.find(i => i.nome === reivindicacao.item);
    if (item) item.status = 'devolvido';

    this.salvarAlteracoes();
  }

  recusarReivindicacao(reivindicacao: any) {
    reivindicacao.status = 'recusado';

    const item = this.itens.find(i => i.nome === reivindicacao.item);
    if (item) item.status = 'descartado';

    this.salvarAlteracoes();
  }

  salvarAlteracoes() {
    localStorage.setItem('reivindicacoes', JSON.stringify(this.reivindicacoes));
    localStorage.setItem('itens', JSON.stringify(this.itens));

    this.calcularEstatisticas();
    this.carregarItensRecentes();
    this.carregarReivindicacoesPendentes();
  }
}
