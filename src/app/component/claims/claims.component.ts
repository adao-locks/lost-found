import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { docData } from 'rxfire/firestore';

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
    const reivindicacoesRef = collection(this.firestore, 'reivindicacoes');
    const itensRef = collection(this.firestore, 'itens');

    this.itens.forEach(item => {
      const itemRef = doc(this.firestore, `itens/${item.id}`);
      setDoc(itemRef, item);
    });

    this.reivindicacoesComItem.forEach(r => {
      const reivindicacaoRef = doc(this.firestore, `reivindicacoes/${r.id}`);
      const novaReivindicacao = {
        usuario: r.usuario,
        item: r.itemDetalhado ? r.itemDetalhado.nome : r.item,
        descricao: r.itemDetalhado?.descricao,
        status: r.status,
        data: r.data,
        local: r.itemDetalhado ? r.itemDetalhado.local : '',
      };
      setDoc(reivindicacaoRef, novaReivindicacao);
    });
  }

  montarReivindicacoesComItem() {
    this.reivindicacoesComItem = this.reivindicacoes.map((r, idx) => {
      const nomeItem = typeof r.item === 'string' ? r.item : r.item?.nome;
      const item = this.itens.find(i => i.nome === nomeItem);
      return { ...r, item, id: idx + 1 };
    });
  }

  registrarHistorico(acao: string, item: string, usuario: string) {
    const historicoRef = collection(this.firestore, 'historico');
    setDoc(doc(historicoRef), {
      acao,
      item,
      usuario,
      data: new Date().toISOString()
    });
  }

}

