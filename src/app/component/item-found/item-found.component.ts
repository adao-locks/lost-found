import { Component } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-item-found',
  standalone: false,
  templateUrl: './item-found.component.html',
  styleUrl: './item-found.component.css'
})
export class ItemFoundComponent {
  itensEncontrados: any[] = [];
  private firestore: Firestore = inject(Firestore);

  async ngOnInit(): Promise<void> {
    const snapshot = await getDocs(collection(this.firestore, 'itens'));
    const todosItens = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    this.itensEncontrados = todosItens.filter((i: any) => i.status !== 'disponivel');
  }
}
