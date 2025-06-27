import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-claims',
  standalone: false,
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.css'
})
export class ClaimsComponent implements OnInit {
  usuarioLogado: any;
  reivindicacoes: any[] = [];
  reivindicacoesComItem: any[] = [];
  itens: any[] = [];

  trackByReivindicacao(index: number, r: any): any {
    return r.id; // ou outro campo único que cada reivindicação tenha
  }

  ngOnInit(): void {
    this.usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    this.reivindicacoes = JSON.parse(localStorage.getItem('reivindicacoes') || '[]');
    this.itens = JSON.parse(localStorage.getItem('itens') || '[]');

    this.montarReivindicacoesComItem();
  }

  aprovar(r: any) {
    r.status = 'aprovado';
    if (r.itemDetalhado) {
      r.itemDetalhado.status = 'devolvido';
      this.registrarHistorico('Aprovação', r.itemDetalhado.nome, this.usuarioLogado.nome);
    }
    this.persistirDados();
    this.montarReivindicacoesComItem();
  }

  recusar(r: any) {
    r.status = 'recusado';
    if (r.itemDetalhado) {
      r.itemDetalhado.status = 'descartado';
      this.registrarHistorico('Recusa', r.itemDetalhado.nome, this.usuarioLogado.nome);
    }
    this.persistirDados();
    this.montarReivindicacoesComItem();
  }

  persistirDados() {
    // Atualiza reivindicacoes baseadas em reivindicacoesComItem
    this.reivindicacoes = this.reivindicacoesComItem.map(r => ({
      usuario: r.usuario,
      item: r.itemDetalhado ? r.itemDetalhado.nome : r.item,
      descricao: r.itemDetalhado?.descricao,
      status: r.status,
      data: r.data,
      id: r.id,
      local: r.itemDetalhado ? r.itemDetalhado.local : '',
    }));

    localStorage.setItem('reivindicacoes', JSON.stringify(this.reivindicacoes));
    localStorage.setItem('itens', JSON.stringify(this.itens));
  }

  montarReivindicacoesComItem() {
    this.reivindicacoesComItem = this.reivindicacoes.map((r, idx) => {
      const nomeItem = typeof r.item === 'string' ? r.item : r.item?.nome;
      const item = this.itens.find(i => i.nome === nomeItem);
      return { ...r, item, id: idx + 1 };
    });
  }

  registrarHistorico(acao: string, item: string, usuario: string) {
    const historico = JSON.parse(localStorage.getItem('historico') || '[]');
    historico.push({
      acao,
      item,
      usuario,
      data: new Date().toISOString()
    });
    localStorage.setItem('historico', JSON.stringify(historico));
  }
}

