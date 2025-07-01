import { Component, ElementRef, ViewChild } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-historic',
  standalone: false,
  templateUrl: './historic.component.html',
  styleUrl: './historic.component.css'
})
export class HistoricComponent {
  historico: any[] = [];
  private firestore: Firestore = inject(Firestore);
  @ViewChild('relatorioPDF', { static: false }) relatorioPDF!: ElementRef;

  itens = [
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
