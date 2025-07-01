import { Component, ElementRef, ViewChild } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-item-found',
  standalone: false,
  templateUrl: './item-found.component.html',
  styleUrl: './item-found.component.css'
})
export class ItemFoundComponent {
  itensEncontrados: any[] = [];
  private firestore: Firestore = inject(Firestore);
  @ViewChild('relatorioPDF', { static: false }) relatorioPDF!: ElementRef;

  itensexp = [
    { titulo: 'Chave encontrada', dataCadastro: new Date() },
    { titulo: 'Celular Samsung', dataCadastro: new Date('2025-06-15') },
    // ...dados reais aqui
  ];

  exportarPDF() {
    const element = this.relatorioPDF.nativeElement;

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('relatorio-itens.pdf');
    });
  }

  async ngOnInit(): Promise<void> {
    const snapshot = await getDocs(collection(this.firestore, 'itens'));
    const todosItens = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    this.itensEncontrados = todosItens.filter((i: any) => i.status !== 'disponivel');
  }
}
