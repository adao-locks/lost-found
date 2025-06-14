import { Component } from '@angular/core';

@Component({
  selector: 'app-historic',
  standalone: false,
  templateUrl: './historic.component.html',
  styleUrl: './historic.component.css'
})
export class HistoricComponent {
  historico: any[] = [];

  ngOnInit(): void {
    this.carregarHistorico();
  }

  carregarHistorico() {
    const data = localStorage.getItem('historico');
    this.historico = data ? JSON.parse(data) : [];
    this.historico.sort(
      (a: any, b: any) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }
}
