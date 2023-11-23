import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
import { ConfirmationService, MessageService } from "primeng/api";
import { Calendario, ICalendario } from "src/models/calendario.model";
import { Campeonato } from "src/models/campeonato.model";
import { IDatos } from "src/models/datos.model";
import { IEquipo } from "src/models/equipo.model";
import { CalendarioService } from "src/services/calendario.service";
import { CampeonatoService } from "src/services/campeonato.service";
import { DatosService } from "src/services/datos.service";
import { EquipoService } from "src/services/equipo.service";
import { TokenStorageService } from "src/services/tokenStorage.service";
import { commonMessages } from "src/shared/constants/commonMessages";
import { IlistarCalendarios, IlistarEquipos, IOpcionVo } from "src/shared/vo/opcion-vo";

@Component({
    selector: 'calendario',
    templateUrl: './calendario.component.html',
    styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit{
  formDatosHorarioEditar!: FormGroup;
  listaTablaCalendario : Array<ICalendario> = [];
  filaTablaCalendario : Array<ICalendario> = [];
  valorTabla = 1;  
  listaEquiposMostrar: Array<IlistarEquipos> = [];
  listaCalendarioMostrar: Array<IlistarCalendarios> = [];
  listaCalendarioMostrar2: Array<IlistarCalendarios> = [];
  listaCalendarioListar: Array<IlistarCalendarios> = [];
  listaEquipos: Array<IEquipo> = [];
  listaCategorias: Array<IDatos> = [];
  listaFases: IOpcionVo[] = commonMessages.ARRAY_FASES;
  tokenUser = "";
  idTorneo = 0;
  labels = commonMessages;
  torneoValue!: Campeonato;
  categoriaValue: any;
  horaEncuentro: Date;
  fechaEncuentro: Date;
  usuarioEnSesion: any;
  valor: any;
  rutaHeaderFutbol = "assets/img/header_planilla_futbol.jpg";
  rutaBodyFutbol = "assets/img/body_planilla_futbol.jpg";
  rutaFooterFutbol = "assets/img/footer_planilla_futbol.jpg";
  fechaSabado: any;
  fechaDomingo: any;
  displayModalHorario: boolean;
  horario: any;
  calendarioEditar! : Calendario;
  validacionIncorrecta : false;
  mensajeFecha :any;
  mensajeHora :any;
  mensajeEquipoA :any;
  mensajeEquipoB :any;
  deporteValue = "";

  constructor(
    private equipoService: EquipoService,
    private route: ActivatedRoute,
    private campeonatoService: CampeonatoService,
    private tokenStorage: TokenStorageService,
    private calendarioService: CalendarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private datosService: DatosService
    ) {
    const valor = this.route.snapshot.queryParamMap.get('valor')!;
    this.valor = valor;
    this.usuarioEnSesion = JSON.parse(sessionStorage.getItem("auth-user"));
      
  }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()){
      this.tokenUser = this.tokenStorage.getToken();
    }
    const param = this.route.snapshot.queryParamMap.get('torneo')!;
    this.idTorneo = parseInt(param, 10);
    if(this.valor !== 'x'){
      this.cargarEquipo(this.idTorneo);
      this.cargarCategoriaToken();
    }else{
      this.cargarCategoria();
    }
    this.crearFormularioHorario();
    
  } 

  cargarCategoria(): void {
    this.datosService.getDatosByCategoria("categoria").subscribe(data => {
      data.forEach(element => {
        this.listaCategorias.push({
          id: element.id,
          categoria: element.categoria,
          codigo: element.codigo,
          nombre: element.nombre 
        });
      });
      setTimeout(() => {
        this.cargarTorneo(this.idTorneo);
        this.cargarEquiposDias();
      }, 1000); 
      
    });
  }
  cargarCategoriaToken(): void {
    this.datosService.getDatosByCategoria("categoria").subscribe(data => {
      data.forEach(element => {
        this.listaCategorias.push({
          id: element.id,
          categoria: element.categoria,
          codigo: element.codigo,
          nombre: element.nombre 
        });
      });
      setTimeout(() => {
        this.cargarTorneo(this.idTorneo);
        this.cargarEquiposDiasByToken(this.tokenUser, this.idTorneo);
      }, 1000); 
      
    });
  }

  crearFormularioHorario(): void {
    this.formDatosHorarioEditar = this.fb.group({
      id: ['',[Validators.required]],
      hora: ['',[Validators.required]],
      fecha: ['',[Validators.required]],
      equipoa: ['',[Validators.required]],
      equipob: ['',[Validators.required]],
      fase: ['',[Validators.required]],
      jornada: ['',[Validators.required]]
    });
  }

  cargarFormularioHorario(): void {
    console.log("carga horario");
    console.log(this.horario);
    
    if(this.horario){
      this.formDatosHorarioEditar.patchValue({
        id: this.horario.id,
        hora: this.horario.hora,
        fecha: this.horario.fecha,
        equipoa: this.horario.equipoa,
        equipob: this.horario.equipob,
        fase: this.horario.fase,
        jornada: this.horario.jornada
      });
    }
  }

  showModalDialog(horario:any) {
    this.horario = horario;
    this.cargarFormularioHorario();
    this.displayModalHorario = true;
  }

  agregarFila(): void{
    this.filaTablaCalendario.push({ fase:"",jornada:1, hora: new Date(), fecha: new Date(), equipoA: "", equipoB: "", categoria: this.categoriaValue.nombre});
    this.valorTabla = this.valorTabla +1;
  }

  eliminarFila(): void{
    this.valorTabla = this.valorTabla - 1;
    this.filaTablaCalendario.pop();
  }

  cargarEquipo(torneo: any): void{
    this.listaEquiposMostrar = [];
    this.equipoService.getEquipoByTorneo(torneo, this.tokenUser).subscribe(equipos =>{
      this.listaEquipos = equipos;
      this.listaEquipos.forEach(element => {
        this.listaEquiposMostrar.push({
          id: element.id.toString(),
          nombre: element.nombre,
          campeonato: element.idCampeonato.nombreCampeonato,
          delegado: element.delegado.nombre,
          idCampeonato: element.idCampeonato.id,
          idDelegado: element.delegado.id
        });
      });
    },err => {
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

  cargarTorneo(torneo:any): void{
    console.log("cate");
    console.log(this.listaCategorias);
    
    this.campeonatoService.getCampeonato(torneo).subscribe(data => {
      this.torneoValue = data;
      if(this.torneoValue.deporte == 1){
        this.deporteValue = "Fútbol";
      }else if(this.torneoValue.deporte == 2){
        this.deporteValue = "Baloncesto";
      }else if(this.torneoValue.deporte == 3){
        this.deporteValue = "Fútbol Sala";
      }
      this.categoriaValue = this.listaCategorias.find((obj => obj.codigo == this.torneoValue.categoria));      
    },err => {
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

  guardarCalendario(): void{
    this.filaTablaCalendario.forEach(element => {
      element.fecha = this.fechaEncuentro;
      element.idCampeonato = this.torneoValue;
      this.calendarioService.create(element, this.tokenUser ).subscribe(response => {
        this.showSuccessCalendario();
        this.ngOnInit();
        this.filaTablaCalendario = [];
      },err => {
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
    });
  }

  cargarEquiposDias(): void{
    this.calendarioService.getCalendariosByCampeonato(this.idTorneo).subscribe(data => {
      this.listaTablaCalendario = data;
      this.listaTablaCalendario.forEach(element => {
        this.listaCalendarioMostrar.push({
          id: element.id,
          hora: this.setCeroHora(new Date(element.hora).getHours(),new Date(element.hora).getMinutes()),
          equipoa: element.equipoA,
          equipob: element.equipoB,
          categoria: element.categoria,
          fecha: element.fecha.toString().substring(0,10),
          fase: element.fase,
          jornada: element.jornada
        });
      },err => {
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
    });
  }

  getUniqueDates(): string[] {
    const uniqueDates = [...new Set(this.listaCalendarioMostrar.map(obj => obj.fecha))];
    return uniqueDates;
  }

  cargarEquiposDiasByToken(token:any, idCampeonato:any): void{
    this.listaCalendarioMostrar = [];
    this.listaCalendarioListar = [];
    this.listaCalendarioMostrar2 = [];
    this.calendarioService.getCalendariosWithToken(token, idCampeonato).subscribe(data => {
      this.listaTablaCalendario = data;
      this.listaTablaCalendario.forEach(element => {
          this.listaCalendarioListar.push({
            id: element.id,
            hora: this.setCeroHora(new Date(element.hora).getHours(),new Date(element.hora).getMinutes()),
            equipoa: element.equipoA,
            equipob: element.equipoB,
            categoria: element.categoria,
            fecha: element.fecha.toString().substring(0,10),
            fase: element.fase,
            jornada: element.jornada
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

  formatAMPM(date:any): any {
    return new Date(date).toLocaleTimeString().replace(/:\d+ /, ' ');
    // var hours = new Date(date).getHours();
    // var minutes = new Date(date).getMinutes();
    // var ampm = hours >= 12 ? 'pm' : 'am';
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'
    // minutes = minutes < 10 ? '0'+minutes : minutes;
    // var strTime = hours + ':' + minutes + ' ' + ampm;
    // return strTime;
  }

  eliminarHorario(calendario: any): void{
    this.confirmationService.confirm({
      message: 'Seguro desea eliminar el partido?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.calendarioService.delete(calendario.id, this.tokenUser).subscribe(
          data => {
            this.showSuccessDelete();
            this.ngOnInit();
          },
          err => {
            if(err.error.error === "Forbidden"){
              this.showErrorTokenExpired();
              sessionStorage.removeItem('auth-user');
              sessionStorage.removeItem('auth-token');
              this.router.navigate(['/']);
              setTimeout(function(){
                this.reloadPage();
              }, 1000); 
            }
            this.showErrorDelete();
          }
        );
      },
      reject: () => {
      }
    });
  }

  editarHorario(){
    this.calendarioEditar = new Calendario();
    this.validacionIncorrecta = false;
    this.mensajeFecha = "";
    this.mensajeHora = "";
    this.mensajeEquipoA = "";
    this.mensajeEquipoB = "";
    this.calendarioEditar.id = this.formDatosHorarioEditar.controls['id'].value;
    this.calendarioEditar.equipoA = this.formDatosHorarioEditar.controls['equipoa'].value;
    this.calendarioEditar.equipoB = this.formDatosHorarioEditar.controls['equipob'].value;
    this.calendarioEditar.categoria = this.categoriaValue.nombre;
    this.calendarioEditar.idCampeonato = this.torneoValue;
    this.calendarioEditar.fecha = this.setDayMore(new Date(this.formDatosHorarioEditar.controls['fecha'].value));
    this.calendarioEditar.hora = this.formatHour(new Date(this.formDatosHorarioEditar.controls['fecha'].value), this.formDatosHorarioEditar.controls['hora'].value);
    this.calendarioEditar.fase = this.formDatosHorarioEditar.controls['fase'].value;
    this.calendarioEditar.jornada = this.formDatosHorarioEditar.controls['jornada'].value;
    this.calendarioService.update(this.calendarioEditar,this.tokenUser).subscribe(value => {
      this.displayModalHorario = false;
      this.ngOnInit();
      this.showSuccessEditarCalendario();
    },err => {
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

  setDayMore(fecha:Date): any{
    fecha.setDate(fecha.getDate() + 1);
    return fecha;
  }

  formatHour(fecha:Date, hora:string): any{
    fecha.setHours(parseInt(hora.substring(0,2)));
    fecha.setMinutes(parseInt(hora.substring(3)));
    return fecha;
  }

  showSuccessDelete() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Horario eliminado correctamente'});
  }

  showErrorDelete() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo eliminar el horario'});
  }

  showSuccessCalendario() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Calendario agendado correctamente!'});
  }

  showSuccessEditarCalendario() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Calendario actualizado correctamente!'});
  }

  showErrorTokenExpired() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'Token Expirado debe iniciar sesión'});
  }

  downloadPDF() {
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
      docResult.save(`${new Date().toISOString()}_programacion.pdf`);
    });
  }

}