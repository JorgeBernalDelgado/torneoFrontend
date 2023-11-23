import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { IDetallePartido } from "src/models/detallepartido.model";
import { DetallePartidoService } from "src/services/detallePartido.service";
import { TokenStorageService } from "src/services/tokenStorage.service";
import { IlistarDetallePartido } from "src/shared/vo/opcion-vo";
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
    selector: 'reportes',
    templateUrl: './reportes.component.html',
    styleUrls: ['./reportes.component.scss']
  })
export class ReportesComponent implements OnInit{
  @ViewChild('htmlData', { static: false }) htmlData: ElementRef;
  listaDetallePartidoMostrar: Array<IlistarDetallePartido> = [];
  listaDetallePartido: Array<IDetallePartido> = [];
  tokenUser = "";
  idTorneo = 0;

  constructor(
    private tokenStorage: TokenStorageService,
    private detallePartidoService: DetallePartidoService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {}
    
  ngOnInit(): void {
    if(this.tokenStorage.getToken()){
      this.tokenUser = this.tokenStorage.getToken();
    }
    const param = this.route.snapshot.queryParamMap.get('torneo')!;
    this.idTorneo = parseInt(param, 10);
    this.listarDetallePartido();
  }

  listarDetallePartido(): void{
    this.detallePartidoService.getDetallePartido(this.idTorneo,this.tokenUser).subscribe(data => {
      console.log("detalle");
      console.log(data);
      this.listaDetallePartido = data;
      this.listaDetallePartido.forEach(element => {
        this.listaDetallePartidoMostrar.push({
          id: element.id.toString(),
          anotacionesa: element.anotacionesa.toString(),
          anotacionesb: element.anotacionesb.toString(),
          arbitro: element.arbitro,
          categoria: element.categoria,
          equipoGanador: element.equipoGanador,
          fecha: element.fecha.toString().substring(0,10),
          hora: this.setCeroHora(new Date(element.hora).getHours(),new Date(element.hora).getMinutes()),
          informeArbitral: element.informeArbitral,
          juez1: element.juez1,
          juez2: element.juez2,
          campeonato: element.campeonato.nombreCampeonato,
          equipoa: element.equipoa.nombre,
          equipob: element.equipob.nombre,
          fase: element.fase,
          jornada: element.jornada.toString()
        });
      });

    }, err => {
      if(err.error.error === "Forbidden"){
        this.showErrorTokenExpired();
        sessionStorage.removeItem('auth-user');
        sessionStorage.removeItem('auth-token');
        this.router.navigate(['/']);
        setTimeout(function(){
          this.reloadPage();
        }, 1000); 
      }
    })
  }

  showErrorTokenExpired() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'Token Expirado debe iniciar sesión'});
  }

  setCeroHora(hora:any, minuto:any):any{
    let data = "";
    if(hora >= 0 && hora <= 9){
      data = "0" + hora;
    }else{
      data = hora;
    }
    if(minuto >= 0 && minuto <= 9){
      data = data + ":0" + minuto;
    }else{
      data = data + ":"+minuto;
    }
    return data;
  }

  /*downloadPDF() {
    // Extraemos el
    const DATA = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_reporte.pdf`);
    });
  }*/

  downloadPDF() {
    const doc = new jsPDF({
      orientation: 'l', // Formato vertical (Portrait)
      unit: 'px', // Unidad de medida en píxeles
      format: 'a1'// Tamaño de la hoja [ancho, alto]
    });

    const options = {
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontStyle: 'normal',
      },
      columnStyles: {
        0: { columnWidth: 100 },
        1: { columnWidth: 100 },
        2: { columnWidth: 100 },
        3: { columnWidth: 100 },
        4: { columnWidth: 100 },
        5: { columnWidth: 100 },
        6: { columnWidth: 100 },
        7: { columnWidth: 100 },
        8: { columnWidth: 100 },
        9: { columnWidth: 100 },
        10: { columnWidth: 100 },
        11: { columnWidth: 100 },
        12: { columnWidth: 100 },
        13: { columnWidth: 100 },
        14: { columnWidth: 100 },
      },
    };

    setTimeout(() => {
    const htmlData = this.htmlData.nativeElement;
    const columns = [
      { header: 'Anotaciones EquipoA', dataKey: 'anotacionesa' },
      { header: 'Anotaciones EquipoB', dataKey: 'anotacionesb' },
      { header: 'Arbitro', dataKey: 'arbitro' },
      { header: 'Categoría', dataKey: 'categoria' },
      { header: 'Ganador del Equipo', dataKey: 'equipoGanador' },
      { header: 'Fecha', dataKey: 'fecha' },
      { header: 'Hora', dataKey: 'hora' },
      { header: 'Informe Arbitral', dataKey: 'informeArbitral' },
      { header: 'Juez1', dataKey: 'juez1' },
      { header: 'Juez2', dataKey: 'juez2' },
      { header: 'Campeonato', dataKey: 'campeonato' },
      { header: 'EquipoA', dataKey: 'equipoa' },
      { header: 'EquipoB', dataKey: 'equipob' },
      { header: 'Fase', dataKey: 'fase' },
      { header: 'Jornada', dataKey: 'jornada' },
    ];

    const rows = this.listaDetallePartidoMostrar.map(detalle => ({
      anotacionesa: detalle.anotacionesa,
      anotacionesb: detalle.anotacionesb,
      arbitro: detalle.arbitro,
      categoria: detalle.categoria,
      equipoGanador: detalle.equipoGanador,
      fecha: detalle.fecha,
      hora: detalle.hora,
      informeArbitral: detalle.informeArbitral,
      juez1: detalle.juez1,
      juez2: detalle.juez2,
      campeonato: detalle.campeonato,
      equipoa: detalle.equipoa,
      equipob: detalle.equipob,
      fase: detalle.fase,
      jornada: detalle.jornada,
    }));

    doc.autoTable(columns, rows, options);
    doc.save(`${new Date().toISOString()}_reporte.pdf`);
  }, 1000);
  }

}