import { Component, Inject } from '@angular/core';
import { finalize } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(
    private storage: AngularFireStorage
  ) { }

  nome = '';
  local = '';
  data = '';
  descricao: string = '';
  fotoSelecionada: File | null = null;
  urlFoto: string = '';
  status: 'disponivel' | 'devolvido' | 'descartado' = 'disponivel';
  usuarioLogado: any;

  onSubmit() {
    const novoItem = {
      nome: this.nome,
      local: this.local,
      data: this.data,
      status: this.status,
      descricao: this.descricao,
      fotoUrl: this.urlFoto
    };

    const itens = JSON.parse(localStorage.getItem('itens') || '[]');
    itens.push(novoItem);
    localStorage.setItem('itens', JSON.stringify(itens));

    if (this.status === 'disponivel') {
      const reivs = JSON.parse(localStorage.getItem('reivindicacoes') || '[]');
      reivs.push({
        usuario: this.usuarioLogado?.nome || 'Usuário',
        item: this.nome,
        status: 'pendente'
      });
      localStorage.setItem('reivindicacoes', JSON.stringify(reivs));
    }

    this.registrarHistorico('Cadastro', this.nome, this.usuarioLogado.nome);

    this.resetForm();
    alert('Item registrado com sucesso!');
    this.carregarItensRecentes();
  }

  resetForm() {
    this.nome = '';
    this.local = '';
    this.data = new Date().toISOString().split('T')[0];
    this.status = 'disponivel';
  }

  itensRecentes: any[] = [];

  ngOnInit(): void {
    const hoje = new Date();
    this.data = hoje.toISOString().split('T')[0];
    const usuarioStr = localStorage.getItem('usuarioLogado');
    this.usuarioLogado = usuarioStr ? JSON.parse(usuarioStr) : { nome: 'Desconhecido' };
    this.carregarItensRecentes();
  }

  carregarItensRecentes() {
    const itens = JSON.parse(localStorage.getItem('itens') || '[]');
    this.itensRecentes = itens
      .sort((a: any, b: any) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 4);
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fotoSelecionada = file;

      const filePath = `imagens/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.urlFoto = url;
            console.log('URL da imagem:', url);
          });
        })
      ).subscribe();
    }
  }

}
