import { Component } from '@angular/core';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private storage: Storage = inject(Storage);
  imagemURL: string | null = null;
  fileInput!: HTMLInputElement;
  nome = '';
  local = '';
  posse = '';
  data = '';
  descricao: string = '';
  status: 'disponivel' | 'devolvido' | 'descartado' = 'disponivel';
  usuarioLogado: any;
  itensRecentes: any[] = [];

  private firestore: Firestore = inject(Firestore);

  async ngOnInit(): Promise<void> {
    const hoje = new Date();
    this.data = hoje.toISOString().split('T')[0];

    const usuarioStr = localStorage.getItem('usuarioLogado');
    this.usuarioLogado = usuarioStr ? JSON.parse(usuarioStr) : { nome: 'Desconhecido' };

    await this.carregarItensRecentes();
  }

  async onSubmit() {
    this.status = 'disponivel';
    let imagemURL = null;

    if (this.fileInput && this.fileInput.files?.length) {
      const arquivo = this.fileInput.files[0];
      const imgRef = ref(this.storage, `imagens/${Date.now()}_${arquivo.name}`);

      const uploadResult = await uploadBytes(imgRef, arquivo);
      imagemURL = await getDownloadURL(uploadResult.ref);
    }

    const novoItem = {
      nome: this.nome,
      local: this.local,
      posse: this.posse,
      data: this.data,
      status: this.status,
      descricao: this.descricao,
      imagemURL
    };

    const itensRef = collection(this.firestore, 'itens');
    await addDoc(itensRef, novoItem);

    if (this.status === 'disponivel') {
      const reivsRef = collection(this.firestore, 'reivindicacoes');
      await addDoc(reivsRef, {
        usuario: this.usuarioLogado?.nome || 'Usuário',
        item: this.nome,
        status: 'disponivel',
        posse: this.posse,
        data: this.data
      });
    }

    // Registrar no histórico
    await this.registrarHistorico('Cadastro', this.nome, this.usuarioLogado.nome);

    this.resetForm();
    alert('Item registrado com sucesso!');
    await this.carregarItensRecentes();
  }

  setFileInput(element: HTMLInputElement) {
    this.fileInput = element;
  }

  async uploadImagem(event: any) {
    const arquivo: File = event.target.files[0];
    if (!arquivo) return;

    const imgRef = ref(this.storage, `imagens/${arquivo.name}`);

    // Faz upload do arquivo
    await uploadBytes(imgRef, arquivo);

    // Pega a URL pública para exibir ou salvar no banco
    this.imagemURL = await getDownloadURL(imgRef);
  }

  resetForm() {
    this.nome = '';
    this.local = '';
    this.posse = '';
    this.data = new Date().toISOString().split('T')[0];
    this.status = 'disponivel';
    this.descricao = '';
    this.imagemURL = null;
  }

  async carregarItensRecentes() {
    const snapshot = await getDocs(collection(this.firestore, 'itens'));
    const itens = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    this.itensRecentes = itens
      .sort((a: any, b: any) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 4);
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
}
