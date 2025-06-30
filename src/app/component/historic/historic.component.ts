import { Component } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-historic',
  standalone: false,
  templateUrl: './historic.component.html',
  styleUrl: './historic.component.css'
})
export class HistoricComponent {
  historico: any[] = [];
  private firestore: Firestore = inject(Firestore);

  async ngOnInit(): Promise<void> {
    await this.carregarHistorico();
  }

  async carregarHistorico() {
    const historicoSnapshot = await getDocs(collection(this.firestore, 'historico'));
    this.historico = historicoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    this.historico.sort(
      (a: any, b: any) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }

}
