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
  itens: any[] = [];

  ngOnInit(): void {
    const usuarioStr = localStorage.getItem('usuarioLogado');
    this.usuarioLogado = usuarioStr ? JSON.parse(usuarioStr) : { nome: 'Desconhecido' };

    this.reivindicacoes = JSON.parse(localStorage.getItem('reivindicacoes') || '[]');
    this.itens = JSON.parse(localStorage.getItem('itens') || '[]');
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

