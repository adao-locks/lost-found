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
    const usuarioStr = localStorage.getItem('usuarioLogado');
    this.usuarioLogado = usuarioStr ? JSON.parse(usuarioStr) : { nome: 'Desconhecido' };

    const reivindicacoes = JSON.parse(localStorage.getItem('reivindicacoes') || '[]');
    const itens = JSON.parse(localStorage.getItem('itens') || '[]');

    this.reivindicacoesComItem = reivindicacoes.map((r: any) => {
      console.log('Reivindicação:', r);
      const itemRelacionado = itens.find((i: any) => i.nome === r.item);
      return {
        ...r,
        item: itemRelacionado
      };
    });
  }

  aprovar(reivindicacao: any) {
    reivindicacao.status = 'aprovado';
    const item = this.itens.find((i) => i.nome === reivindicacao.item);
    if (item) {
      item.status = 'devolvido';
      this.registrarHistorico('Aprovação', reivindicacao.item, this.usuarioLogado.nome);
    }

    this.salvar();
  }

  recusar(reivindicacao: any) {
    reivindicacao.status = 'recusado';
    const item = this.itens.find((i) => i.nome === reivindicacao.item);
    if (item) {
      item.status = 'descartado';
      this.registrarHistorico('Recusa', reivindicacao.item, this.usuarioLogado.nome);
    }

    this.salvar();
  }

  salvar() {
    localStorage.setItem('reivindicacoes', JSON.stringify(this.reivindicacoes));
    localStorage.setItem('itens', JSON.stringify(this.itens));
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

