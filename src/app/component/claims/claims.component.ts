import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDocs, setDoc, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-claims',
  standalone: false,
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.css'
})
export class ClaimsComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  usuarioLogado: any;
  reivindicacoes: any[] = [];
  reivindicacoesComItem: any[] = [];
  itens: any[] = [];
  filtroItem: string = '';
  filtroUser: string = '';
  filtroLocal: string = '';
  filtroDesc: string = '';
  reivindicacoesFiltradas: any[] = [];

  trackByReivindicacao(index: number, r: any): any {
    return r.id;
  }

  async ngOnInit(): Promise<void> {
    this.usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

    const reivindicacoesSnapshot = await getDocs(collection(this.firestore, 'reivindicacoes'));
    const itensSnapshot = await getDocs(collection(this.firestore, 'itens'));

    this.reivindicacoes = reivindicacoesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    this.itens = itensSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    this.montarReivindicacoesComItem();
    this.reivindicacoesFiltradas = this.reivindicacoesComItem;
  }

  aprovar(r: any) {
    if (!r.item) return;

    r.item.status = 'devolvido';

    this.registrarHistorico('Aprovado', r.item.nome, this.usuarioLogado.nome);
    this.persistirDados();
    this.ngOnInit();
  }

  recusar(r: any) {
    if (!r.item) return;

    r.item.status = 'descartado';

    this.registrarHistorico('Recusado', r.item.nome, this.usuarioLogado.nome);
    this.persistirDados();
    this.ngOnInit();
  }

  persistirDados() {
    const reivindicacoesRef = collection(this.firestore, 'reivindicacoes');
    const itensRef = collection(this.firestore, 'itens');

    this.itens.forEach(item => {
      const itemRef = doc(this.firestore, `itens/${item.id}`);
      setDoc(itemRef, item);
    });

    this.reivindicacoesComItem.forEach(r => {
      const reivindicacaoRef = doc(this.firestore, `reivindicacoes/${r.id}`);
      const { nome, descricao, status, local } = r.item || {};
      const novaReivindicacao = {
        usuario: r.usuario,
        item: nome,
        descricao,
        status,
        data: r.data,
        local: local || '',
      };
      setDoc(reivindicacaoRef, novaReivindicacao);
    });
  }

  montarReivindicacoesComItem() {
    this.reivindicacoesComItem = this.reivindicacoes.map((r, idx) => {
      const nomeItem = typeof r.item === 'string' ? r.item : r.item?.nome;
      const item = this.itens.find(i => i.nome === nomeItem);
      return { ...r, item, indice: idx + 1 };
    });
  }

  async registrarHistorico(acao: string, item: string, usuario: string) {
    const historicoRef = collection(this.firestore, 'historico');
    await addDoc(historicoRef, {
      acao,
      item,
      usuario,
      data: new Date().toISOString()
    });
  }

  filtrarItem() {
    const texto = this.filtroItem.toLowerCase();
    this.reivindicacoesFiltradas = this.reivindicacoesComItem.filter(r =>
      r.item.nome.toLowerCase().includes(texto) ||
      r.usuario.toLowerCase().includes(texto)
    );
  }

  filtrarUsuario() {
    const texto = this.filtroUser.toLowerCase();
    this.reivindicacoesFiltradas = this.reivindicacoesComItem.filter(r =>
      r.usuario.toLowerCase().includes(texto)
    );
  }

  filtrarLocal() {
    const texto = this.filtroLocal.toLowerCase();
    this.reivindicacoesFiltradas = this.reivindicacoesComItem.filter(r =>
      r.item.local.toLowerCase().includes(texto) ||
      r.usuario.toLowerCase().includes(texto)
    );
  }

  filtrarDesc() {
    const texto = this.filtroDesc.toLowerCase();
    this.reivindicacoesFiltradas = this.reivindicacoesComItem.filter(r =>
      r.item.descricao.toLowerCase().includes(texto) ||
      r.usuario.toLowerCase().includes(texto)
    );
  }

}

