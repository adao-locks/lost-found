import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, doc, getDocs, setDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';

interface Item {
  id?: string;
  nome: string;
  local: string;
  data: string;
  status: 'disponivel' | 'devolvido' | 'descartado';
}

interface Reivindicacao {
  id?: string;
  usuario: string;
  item: string;
  status: 'disponivel' | 'aprovado' | 'recusado';
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: false
})
export class DashboardComponent {
  private firestore: Firestore = inject(Firestore);
  usuarioLogado = { nome: '', tipo: 'usuário' };
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

  async ngOnInit(): Promise<void> {
    const usuarioStr = localStorage.getItem('usuarioLogado');
    if (usuarioStr) {
      this.usuarioLogado = JSON.parse(usuarioStr);
      document.body.classList.toggle('admin', this.usuarioLogado.tipo === 'admin');
    }

    const itensSnapshot = await getDocs(collection(this.firestore, 'itens'));
    this.itens = itensSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Item[];

    const reivSnapshot = await getDocs(collection(this.firestore, 'reivindicacoes'));
    this.reivindicacoes = reivSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Reivindicacao, 'id'>) })) as Reivindicacao[];

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
    this.reivindicacoesPendentes = this.reivindicacoes.filter(r => r.status === 'disponivel');
  }

  calcularEstatisticas() {
    this.stats.total = this.itens.length;
    this.stats.disponiveis = this.itens.filter(i => i.status === 'disponivel').length;
    this.stats.devolvidos = this.itens.filter(i => i.status === 'devolvido').length;
    this.stats.reivindicacoes = this.reivindicacoes.filter(r => r.status === 'disponivel').length;
  }

  aprovarReivindicacao(reivindicacao: any) {
    reivindicacao.status = 'devolvido';

    const item = this.itens.find(i => i.nome === reivindicacao.item);
    if (item) {
      item.status = 'devolvido';
      this.registrarHistorico('Aprovação', item.nome, this.usuarioLogado.nome);
    }

    this.salvarAlteracoes();
  }

  recusarReivindicacao(reivindicacao: any) {
    reivindicacao.status = 'descartado';

    const item = this.itens.find(i => i.nome === reivindicacao.item);
    if (item) {
      item.status = 'descartado';
      this.registrarHistorico('Recusado', item.nome, this.usuarioLogado.nome);
    }

    this.salvarAlteracoes();
  }

  async salvarAlteracoes() {
    const itensRef = collection(this.firestore, 'itens');
    const reivsRef = collection(this.firestore, 'reivindicacoes');

    for (const item of this.itens) {
      const itemRef = doc(this.firestore, `itens/${item.id}`);
      await setDoc(itemRef, item);
    }

    for (const r of this.reivindicacoes) {
      const rRef = doc(this.firestore, `reivindicacoes/${r.id}`);
      await setDoc(rRef, r);
    }

    this.calcularEstatisticas();
    this.carregarItensRecentes();
    this.carregarReivindicacoesPendentes();
  }

  async registrarHistorico(acao: string, item: string, usuario: string) {
    const historicoRef = collection(this.firestore, 'historico');
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await setDoc(doc(historicoRef, id), {
      acao,
      item,
      usuario,
      data: new Date().toISOString()
    });
  }

}
