import { Component, OnInit } from "@angular/core";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { EquipoService } from "src/services/equipo.service";
import { ActivatedRoute, Router } from "@angular/router";
import { EquipoDeportistaService } from "src/services/equipoDeportista.service";
import { IlistarEquipoDeportistas } from "src/shared/vo/opcion-vo";
import { IEquipoDeportista } from "src/models/equipodeportista.model";
import { CampeonatoService } from "src/services/campeonato.service";
import { Campeonato } from "src/models/campeonato.model";
import { TokenStorageService } from "src/services/tokenStorage.service";
import { UsuarioService } from "src/services/usuario.service";
import { commonMessages } from "src/shared/constants/commonMessages";
import { MessageService } from "primeng/api";

@Component({
    selector: 'planillas',
    templateUrl: './planillas.component.html',
    styleUrls: ['./planillas.component.scss']
})
export class PlanillasComponent implements OnInit{

  idDelegado = 3;
  idTorneo = 0;
  listaEquipoDeportistas:  Array<IlistarEquipoDeportistas> = [];
  listaEquipoDeportista: Array<IEquipoDeportista> = [];
  rutaHeaderFutbol = "assets/img/header_planilla_futbol.jpg";
  rutaBodyFutbol = "assets/img/body_planilla_futbol.jpg";
  rutaFooterFutbol = "assets/img/footer_planilla_futbol.jpg";
  campeonatovalue!: Campeonato;
  tokenUser = "";
  descargarPlanilla = false;
  labels = commonMessages;

  constructor(
    private equipoService: EquipoService,
    private route: ActivatedRoute,
    private equipoDeportistaService: EquipoDeportistaService,
    private campeonatoService: CampeonatoService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private messageService: MessageService
    ) {
  }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()){
      this.tokenUser = this.tokenStorage.getToken();
      this.idDelegado = this.tokenStorage.getUser().user_id;
    }
    const param = this.route.snapshot.queryParamMap.get('torneo')!;
    this.idTorneo = parseInt(param, 10);
    this.cargarCampeonato(this.idTorneo);
    this.cargarDelegado();
  }

  downloadPDF() {
    this.descargarPlanilla = true;
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
      this.descargarPlanilla = false;
      docResult.save(`${new Date().toISOString()}_planilla.pdf`);
    });
  }

  downloadPDFCarnet(deportista: any) {
    // Extraemos el
    const DATA = document.getElementById(`${deportista.htmlDataCarnet}`);
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 1
    };
    html2canvas(DATA, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      // Add image Canvas to PDF
      const bufferX = 150;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      //const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      console.log("width");
      //console.log(pdfWidth);
      
      //const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      //console.log(pdfHeight);
      const pdfWidth = 300; 
      const pdfHeight = 220;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${deportista.nombre + "_"+ deportista.apellido}_carnet.pdf`);
    });
  }

  cargarDelegado(): void{
    this.equipoService.getEquipoByDelegado(this.idDelegado, this.idTorneo, this.tokenUser).subscribe(data => {
      this.equipoDeportistaService.getEquipoDeportistaByEquipo(data[0].id, this.idTorneo, this.tokenUser).subscribe(response => {
        this.listaEquipoDeportista = response;
        let numeroPlanilla = 1;
        this.listaEquipoDeportista.forEach(element => {
          this.listaEquipoDeportistas.push({
            no: (numeroPlanilla).toString(),
            id: element.id.toString(),
            nombre: element.idDeportista.nombre,
            apellido: element.idDeportista.apellido,
            identificacion: element.idDeportista.identificacion,
            foto: element.idDeportista.fotoDeportista,
            htmlDataCarnet: element.idDeportista.identificacion,
            equipo: element.idEquipo.nombre
          });
          numeroPlanilla++;
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
    });
  }

  cargarCampeonato(torneo:any): void{
    this.campeonatoService.getCampeonato(torneo).subscribe(data => {
      this.campeonatovalue = data;
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
    });
  }

  showErrorTokenExpired() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'Token Expirado debe iniciar sesión'});
  }

}