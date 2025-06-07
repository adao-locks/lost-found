import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  nome = '';
  local = '';
  data = '';
  status: 'disponivel' | 'devolvido' | 'descartado' = 'disponivel';

  onSubmit() {
    const novoItem = {
      nome: this.nome,
      local: this.local,
      data: this.data,
      status: this.status
    };

    const itens = JSON.parse(localStorage.getItem('itens') || '[]');
    itens.push(novoItem);
    localStorage.setItem('itens', JSON.stringify(itens));

    if (this.status === 'disponivel') {
      const reivindicacoes = JSON.parse(localStorage.getItem('reivindicacoes') || '[]');
      reivindicacoes.push({
        usuario: 'Usuário Exemplo',
        item: this.nome,
        status: 'pendente'
      });
      localStorage.setItem('reivindicacoes', JSON.stringify(reivindicacoes));
    }

    alert('Item registrado com sucesso!');
    this.resetForm();
  }

  resetForm() {
    this.nome = '';
    this.local = '';
    this.data = '';
    this.status = 'disponivel';
  }

  itensRecentes: any[] = [];

  ngOnInit(): void {
    this.carregarItensRecentes();
  }

  carregarItensRecentes() {
    const itens = JSON.parse(localStorage.getItem('itens') || '[]');
    this.itensRecentes = itens
      .sort((a: any, b: any) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 4);
  }
}
