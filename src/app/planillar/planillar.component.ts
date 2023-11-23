import { Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DetallePartido } from "src/models/detallepartido.model";
import { Equipo, IEquipo } from "src/models/equipo.model";
import { EquipoService } from "src/services/equipo.service";
import { EquipoDeportistaService } from "src/services/equipoDeportista.service";
import { commonMessages } from "src/shared/constants/commonMessages";
import { IlistarDeportistas, IlistarEquipos, IOpcionVo } from "src/shared/vo/opcion-vo";
import * as moment from "moment";
import { DetallePartidoService } from "src/services/detallePartido.service";
import { Campeonato } from "src/models/campeonato.model";
import { CampeonatoService } from "src/services/campeonato.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { DeportistaService } from "src/services/deportista.service";
import { TokenStorageService } from "src/services/tokenStorage.service";
import { IDatos } from "src/models/datos.model";
import { DatosService } from "src/services/datos.service";

@Component({
    selector: 'planillar',
    templateUrl: './planillar.component.html',
    styleUrls: ['./planillar.component.scss']
})
export class PlanillarComponent implements OnInit{
    idTorneo = 0;
    listaEquiposMostrar: Array<IlistarEquipos> = [];
    listaEquiposMostrarA: Array<IlistarEquipos> = [];
    listaEquiposMostrarB: Array<IlistarEquipos> = [];
    listaEquiposMostrar2: Array<IlistarEquipos> = [];
    listaEquipos: Array<IEquipo> = [];
    labels = commonMessages;
    listaDeportistasMostrar: Array<IlistarDeportistas> = [];
    listaDeportistasTitulares: Array<IlistarDeportistas> = [];
    listaFases: IOpcionVo[] = commonMessages.ARRAY_FASES;
    sourceItemsA = [];
    targetItemsA = [];
    temporalItemsA = [];
    sourceItemsB = [];
    targetItemsB = [];
    temporalItemsB = [];
    arbitroValue = "";
    ciudadValue = "";
    juez1Value = "";
    juez2Value = "";
    fase = "";
    jornada = 0;
    informeArbitralValue = "";
    horaEncuentro: Date;
    fechaEncuentro: Date;
    comenzarPartido = false;
    titularesEquipoA = [];
    titularesEquipoB = [];
    valueGol: boolean;
    valueTA: boolean;
    valueTR: boolean;
    nombreEquipoA: string;
    nombreEquipoB: string;
    isValidA = false;
    isValidB = false;
    anotacionesA = 0;
    anotacionesB = 0;
    faltasABA = 0;
    faltasBBA = 0;
    checkGolA = false;
    checkTAA = false;
    checkTRA = false;
    checkGolB = false;
    checkTAB = false;
    checkTRB = false;
    isValidCheckTAA = true;
    isValidCheckTRA = true;
    isValidCheckTAB = true;
    isValidCheckTRB = true;
    displayModal: boolean;
    displayModalB: boolean;
    seleccionadoA: [];
    seleccionadoB: [];
    deportistaSustituir: any;
    deportistaSustituirB: any;
    detallePartidoGuardar!: DetallePartido;
    equipoAGuardar!: Equipo;
    equipoBGuardar!: Equipo;
    equipoA!: Equipo;
    equipoB!: Equipo;
    torneoValue!: Campeonato;
    listaPeriodos: IOpcionVo[] = commonMessages.ARRAY_PERIODO;
    listaCategorias: Array<IDatos> = [];
    cestaValue: number;
    checkedFaltaABA = false;
    checkedFaltaBBA = false;
    tokenUser = "";
    cronoSeg: number = 0;
    cronoMin: number = 0;
    interval:any;
    pausar = false;
    reanudar = true;
    empezar = false;
    checkedGol = false;
    validacionIncorrecta = false;
    mensajeArbitro = "";
    mensajeFechaEcuentro = "";
    mensajeHoraEncuentro = "";
    mensajeCiudadEncuentro = "";
    mensajeJuez1 = "";
    mensajeJuez2 = "";
    mensajeEquipoA = "";
    mensajeEquipoB = "";
    mensajeInformeArbitral = "";
    mensajeFase = "";
    mensajeJornada = "";
    periodoActual = "Periodo 1";
    numeroMaximoTitularesFutbolA = false;
    numeroMaximoTitularesFutbolB = false;
    mensajeMaximoTitularesFutbolA = "";
    mensajeMaximoTitularesFutbolB = "";
    numeroMinimoTitularesFutbolA = false;
    numeroMinimoTitularesFutbolB = false;
    mensajeMinimoTitularesFutbolA = "";
    mensajeMinimoTitularesFutbolB = "";
    numeroMaximoTitularesBaloncestoA = false;
    numeroMaximoTitularesBaloncestoB = false;
    mensajeMaximoTitularesBaloncestoA = "";
    mensajeMaximoTitularesBaloncestoB = "";
    numeroMinimoTitularesBaloncestoA = false;
    numeroMinimoTitularesBaloncestoB = false;
    mensajeMinimoTitularesBaloncestoA = "";
    mensajeMinimoTitularesBaloncestoB = "";
    numeroMaximoTitularesFutbolSalaA = false;
    numeroMaximoTitularesFutbolSalaB = false;
    mensajeMaximoTitularesFutbolSalaA = "";
    mensajeMaximoTitularesFutbolSalaB = "";
    numeroMinimoTitularesFutbolSalaA = false;
    numeroMinimoTitularesFutbolSalaB = false;
    mensajeMinimoTitularesFutbolSalaA = "";
    mensajeMinimoTitularesFutbolSalaB = "";
    mensajeSustiturJugador = "";
    mensajeSustituirJugadorA = "";
    mensajeSustituirJugadorB = "";
    banderaItemB = "";
    banderaItemA = "";

    constructor(
        private route: ActivatedRoute,
        private equipoService: EquipoService,
        private equipoDeportistaService: EquipoDeportistaService,
        private detallePartidoService: DetallePartidoService,
        private campeonatoService: CampeonatoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private deportistaService: DeportistaService,
        private router: Router,
        private tokenStorage: TokenStorageService,
        private datosService: DatosService
      ) {
    }

    ngOnInit(): void {
      if(this.tokenStorage.getToken()){
        this.tokenUser = this.tokenStorage.getToken();
      }
      const param = this.route.snapshot.queryParamMap.get('torneo')!;
      this.idTorneo = parseInt(param, 10);
      this.cargarEquipo(this.idTorneo);
      this.cargarTorneo(this.idTorneo);
      this.cargarCategoria();
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
      });
    }

    showModalDialog() {
      this.displayModal = true;
    }
  
    hideModalDialog() {
      this.displayModal = false;
    }

    showModalDialogB() {
      this.displayModalB = true;
    }
  
    hideModalDialogB() {
      this.displayModalB = false;
    }

    cargarEquipo(torneo: any): void{
        this.listaEquiposMostrar = [];
        this.listaEquiposMostrarA = [];
        this.listaEquiposMostrarB = [];
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
          this.listaEquiposMostrarA = this.listaEquiposMostrar;
          this.listaEquiposMostrarB = this.listaEquiposMostrar;
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

    cargarTorneo(torneo:any): void{
      this.campeonatoService.getCampeonato(torneo).subscribe(data => {
        this.torneoValue = data;
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

    onChangeA(event:any):void{
      const elementIndex = this.listaEquiposMostrarB.findIndex(obj => obj.nombre === event);
      if(this.banderaItemB !== ""){
        const elementIndexB = this.listaEquiposMostrarA.find(obj => obj.nombre === this.banderaItemB);
        if (elementIndex !== -1) {
          // Crear una nueva copia de listaEquiposMostrarB sin el elemento
          this.listaEquiposMostrarB = [
            ...this.listaEquiposMostrarB.slice(0, elementIndex),
            ...this.listaEquiposMostrarB.slice(elementIndex + 1)
          ];
          this.banderaItemB = event;
        }
        this.listaEquiposMostrarB.push(elementIndexB);
      }else{
        if (elementIndex !== -1) {
          // Crear una nueva copia de listaEquiposMostrarB sin el elemento
          this.listaEquiposMostrarB = [
            ...this.listaEquiposMostrarB.slice(0, elementIndex),
            ...this.listaEquiposMostrarB.slice(elementIndex + 1)
          ];
          this.banderaItemB = event;
        }
      }
      this.sourceItemsA = [];
      this.targetItemsA = [];
      this.temporalItemsA = [];
      this.equipoService.getEquipoByName(event, this.tokenUser).subscribe(equipo => {
        this.equipoA = equipo[0];
        this.nombreEquipoA = equipo[0].nombre;
        this.equipoDeportistaService.getEquipoDeportistaByEquipo(equipo[0].id, this.torneoValue.id, this.tokenUser).subscribe(data => {
          data.forEach(element => {
            this.temporalItemsA.push({id:element.idDeportista.id.toString(),nombre:element.idDeportista.nombre + " " + element.idDeportista.apellido,
            checkedGol: false, checkedTA: false, checkedDobleTA: true, isValidDobleTA: false,checkedTR: false, posicion:element.idDeportista.posicion});
          });
          this.sourceItemsA = this.temporalItemsA;
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

    onChangeB(event:any):void{
      const elementIndex = this.listaEquiposMostrarA.findIndex(obj => obj.nombre === event);
      if(this.banderaItemA !== ""){
        const elementIndexA = this.listaEquiposMostrarB.find(obj => obj.nombre === this.banderaItemA);
        if (elementIndex !== -1) {
          // Crear una nueva copia de listaEquiposMostrarB sin el elemento
          this.listaEquiposMostrarA = [
            ...this.listaEquiposMostrarA.slice(0, elementIndex),
            ...this.listaEquiposMostrarA.slice(elementIndex + 1)
          ];
          this.banderaItemA = event;
        }
        this.listaEquiposMostrarA.push(elementIndexA);
      }else{
        if (elementIndex !== -1) {
          // Crear una nueva copia de listaEquiposMostrarB sin el elemento
          this.listaEquiposMostrarA = [
            ...this.listaEquiposMostrarA.slice(0, elementIndex),
            ...this.listaEquiposMostrarA.slice(elementIndex + 1)
          ];
          this.banderaItemA = event;
        }
      }
      this.sourceItemsB = [];
      this.targetItemsB = [];
      this.temporalItemsB = [];
      this.equipoService.getEquipoByName(event, this.tokenUser).subscribe(equipo => {
        this.equipoB = equipo[0];
        this.nombreEquipoB = equipo[0].nombre;
        this.equipoDeportistaService.getEquipoDeportistaByEquipo(equipo[0].id, this.torneoValue.id, this.tokenUser).subscribe(data => {
          data.forEach(element => {
            this.temporalItemsB.push({id:element.idDeportista.id.toString(),nombre:element.idDeportista.nombre + " " + element.idDeportista.apellido,
            checkedGol: false, checkedTA: false, checkedDobleTA: true, isValidDobleTA: false, checkedTR: false, posicion:element.idDeportista.posicion});
          });
          this.sourceItemsB = this.temporalItemsB;
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

    onChangeABA(event:any):void{
      const elementIndex = this.listaEquiposMostrarB.findIndex(obj => obj.nombre === event);
      if(this.banderaItemB !== ""){
        const elementIndexB = this.listaEquiposMostrarA.find(obj => obj.nombre === this.banderaItemB);
        if (elementIndex !== -1) {
          // Crear una nueva copia de listaEquiposMostrarB sin el elemento
          this.listaEquiposMostrarB = [
            ...this.listaEquiposMostrarB.slice(0, elementIndex),
            ...this.listaEquiposMostrarB.slice(elementIndex + 1)
          ];
          this.banderaItemB = event;
        }
        this.listaEquiposMostrarB.push(elementIndexB);
      }else{
        if (elementIndex !== -1) {
          // Crear una nueva copia de listaEquiposMostrarB sin el elemento
          this.listaEquiposMostrarB = [
            ...this.listaEquiposMostrarB.slice(0, elementIndex),
            ...this.listaEquiposMostrarB.slice(elementIndex + 1)
          ];
          this.banderaItemB = event;
        }
      }
      this.sourceItemsA = [];
      this.targetItemsA = [];
      this.temporalItemsA = [];
      this.equipoService.getEquipoByName(event, this.tokenUser).subscribe(equipo => {
        this.equipoA = equipo[0];
        this.nombreEquipoA = equipo[0].nombre;
        this.equipoDeportistaService.getEquipoDeportistaByEquipo(equipo[0].id, this.torneoValue.id, this.tokenUser).subscribe(data => {
          data.forEach(element => {
            this.temporalItemsA.push({id:element.idDeportista.id.toString(),nombre:element.idDeportista.nombre + " " + element.idDeportista.apellido,
            checkedCesta: false,checkedFalta: false, numFaltas:0});
          });
          this.sourceItemsA = this.temporalItemsA;
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

    onChangeBBA(event:any):void{
      const elementIndex = this.listaEquiposMostrarA.findIndex(obj => obj.nombre === event);
      if(this.banderaItemA !== ""){
        const elementIndexA = this.listaEquiposMostrarB.find(obj => obj.nombre === this.banderaItemA);
        if (elementIndex !== -1) {
          // Crear una nueva copia de listaEquiposMostrarB sin el elemento
          this.listaEquiposMostrarA = [
            ...this.listaEquiposMostrarA.slice(0, elementIndex),
            ...this.listaEquiposMostrarA.slice(elementIndex + 1)
          ];
          this.banderaItemA = event;
        }
        this.listaEquiposMostrarA.push(elementIndexA);
      }else{
        if (elementIndex !== -1) {
          // Crear una nueva copia de listaEquiposMostrarB sin el elemento
          this.listaEquiposMostrarA = [
            ...this.listaEquiposMostrarA.slice(0, elementIndex),
            ...this.listaEquiposMostrarA.slice(elementIndex + 1)
          ];
          this.banderaItemA = event;
        }
      }
      this.sourceItemsB = [];
      this.targetItemsB = [];
      this.temporalItemsB = [];
      this.equipoService.getEquipoByName(event, this.tokenUser).subscribe(equipo => {
        this.equipoB = equipo[0];
        this.nombreEquipoB = equipo[0].nombre;
        this.equipoDeportistaService.getEquipoDeportistaByEquipo(equipo[0].id, this.torneoValue.id, this.tokenUser).subscribe(data => {
          data.forEach(element => {
            this.temporalItemsB.push({id:element.idDeportista.id.toString(),nombre:element.idDeportista.nombre + " " + element.idDeportista.apellido,
            checkedCesta: false,checkedFalta: false, isValidB:false, numFaltas:0});
          });
          this.sourceItemsB = this.temporalItemsB;
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

    onChangeAFU(event:any):void{
      const elementIndex = this.listaEquiposMostrarB.findIndex(obj => obj.nombre === event);
      if(this.banderaItemB !== ""){
        const elementIndexB = this.listaEquiposMostrarA.find(obj => obj.nombre === this.banderaItemB);
        if (elementIndex !== -1) {
          // Crear una nueva copia de listaEquiposMostrarB sin el elemento
          this.listaEquiposMostrarB = [
            ...this.listaEquiposMostrarB.slice(0, elementIndex),
            ...this.listaEquiposMostrarB.slice(elementIndex + 1)
          ];
          this.banderaItemB = event;
        }
        this.listaEquiposMostrarB.push(elementIndexB);
      }else{
        if (elementIndex !== -1) {
          // Crear una nueva copia de listaEquiposMostrarB sin el elemento
          this.listaEquiposMostrarB = [
            ...this.listaEquiposMostrarB.slice(0, elementIndex),
            ...this.listaEquiposMostrarB.slice(elementIndex + 1)
          ];
          this.banderaItemB = event;
        }
      }
      this.sourceItemsA = [];
      this.targetItemsA = [];
      this.temporalItemsA = [];
      this.equipoService.getEquipoByName(event, this.tokenUser).subscribe(equipo => {
        this.equipoA = equipo[0];
        this.nombreEquipoA = equipo[0].nombre;
        this.equipoDeportistaService.getEquipoDeportistaByEquipo(equipo[0].id, this.torneoValue.id, this.tokenUser).subscribe(data => {
          data.forEach(element => {
            this.temporalItemsA.push({id:element.idDeportista.id.toString(),nombre:element.idDeportista.nombre + " " + element.idDeportista.apellido,
            checkedGol: false, checkedTA: false,checkedDobleTA: true, isValidDobleTA: false, checkedTR: false, posicion:element.idDeportista.posicion});
          });
          this.sourceItemsA = this.temporalItemsA;
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

    onChangeBFU(event:any):void{
      const elementIndex = this.listaEquiposMostrarA.findIndex(obj => obj.nombre === event);
      if(this.banderaItemA !== ""){
        const elementIndexA = this.listaEquiposMostrarB.find(obj => obj.nombre === this.banderaItemA);
        if (elementIndex !== -1) {
          // Crear una nueva copia de listaEquiposMostrarB sin el elemento
          this.listaEquiposMostrarA = [
            ...this.listaEquiposMostrarA.slice(0, elementIndex),
            ...this.listaEquiposMostrarA.slice(elementIndex + 1)
          ];
          this.banderaItemA = event;
        }
        this.listaEquiposMostrarA.push(elementIndexA);
      }else{
        if (elementIndex !== -1) {
          // Crear una nueva copia de listaEquiposMostrarB sin el elemento
          this.listaEquiposMostrarA = [
            ...this.listaEquiposMostrarA.slice(0, elementIndex),
            ...this.listaEquiposMostrarA.slice(elementIndex + 1)
          ];
          this.banderaItemA = event;
        }
      }
      this.sourceItemsB = [];
      this.targetItemsB = [];
      this.temporalItemsB = [];
      this.equipoService.getEquipoByName(event, this.tokenUser).subscribe(equipo => {
        this.equipoB = equipo[0];
        this.nombreEquipoB = equipo[0].nombre;
        this.equipoDeportistaService.getEquipoDeportistaByEquipo(equipo[0].id, this.torneoValue.id, this.tokenUser).subscribe(data => {
          data.forEach(element => {
            this.temporalItemsB.push({id:element.idDeportista.id.toString(),nombre:element.idDeportista.nombre + " " + element.idDeportista.apellido,
            checkedGol: false, checkedTA: false,checkedDobleTA: true, isValidDobleTA: false,checkedTR: false, posicion:element.idDeportista.posicion});
          });
          this.sourceItemsB = this.temporalItemsB;
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

    siguiente(): any{
      this.validacionIncorrecta = false;
      if(!this.arbitroValue){
        this.validacionIncorrecta = true;
        this.mensajeArbitro = this.labels.CAMPO_OBLIGATORIO_LABEL;
      }
      if(!this.fechaEncuentro){
        this.validacionIncorrecta = true;
        this.mensajeFechaEcuentro = this.labels.CAMPO_OBLIGATORIO_LABEL;
      }
      if(!this.horaEncuentro){
        this.validacionIncorrecta = true;
        this.mensajeHoraEncuentro = this.labels.CAMPO_OBLIGATORIO_LABEL;
      }
      if(!this.ciudadValue){
        this.validacionIncorrecta = true;
        this.mensajeCiudadEncuentro = this.labels.CAMPO_OBLIGATORIO_LABEL;
      }
      if(!this.juez1Value){
        this.validacionIncorrecta = true;
        this.mensajeJuez1 = this.labels.CAMPO_OBLIGATORIO_LABEL;
      }
      if(!this.juez2Value){
        this.validacionIncorrecta = true;
        this.mensajeJuez2 = this.labels.CAMPO_OBLIGATORIO_LABEL;
      }
      if(!this.equipoA){
        this.validacionIncorrecta = true;
        this.mensajeEquipoA = this.labels.CAMPO_OBLIGATORIO_LABEL;
      }
      if(!this.equipoA){
        this.validacionIncorrecta = true;
        this.mensajeEquipoB = this.labels.CAMPO_OBLIGATORIO_LABEL;
      }
      if(!this.fase){
        this.validacionIncorrecta = true;
        this.mensajeFase = this.labels.CAMPO_OBLIGATORIO_LABEL;
      }
      if(!this.jornada && this.jornada == 0){
        this.validacionIncorrecta = true;
        this.mensajeJornada = this.labels.CAMPO_OBLIGATORIO_LABEL;
      }
      if(!this.validacionIncorrecta){
        this.comenzarPartido = true;
        this.titularesEquipoA = this.targetItemsA;
        this.titularesEquipoB = this.targetItemsB;
      }
    }

    cambioJugadorA(item:any):void{
      this.deportistaSustituir = item;
      this.mensajeSustiturJugador = "Sustituir jugador "+item.nombre;
      this.showModalDialog();
    }

    sustituirDeportista():void{
      if(!this.seleccionadoA){
        this.mensajeSustituirJugadorA = this.labels.CAMPO_OBLIGATORIO_LABEL;
      }else{
        const elementIndex = this.targetItemsA.findIndex((obj => obj.id == this.deportistaSustituir.id));
        this.targetItemsA.splice(elementIndex,1);
        const elementIndex2 = this.sourceItemsA.find((obj => obj.id == this.seleccionadoA));
        this.targetItemsA.push(elementIndex2);
        this.hideModalDialog();
      }
    }

    cambioJugadorB(item:any):void{
      this.deportistaSustituirB = item;
      this.mensajeSustiturJugador = "Sustituir jugador "+item.nombre;
      this.showModalDialogB();
    }

    sustituirDeportistaB():void{
      if(!this.seleccionadoB){
        this.mensajeSustituirJugadorB = this.labels.CAMPO_OBLIGATORIO_LABEL;
      }else{
        const elementIndex = this.targetItemsB.findIndex((obj => obj.id == this.deportistaSustituirB.id));
        this.targetItemsB.splice(elementIndex,1);
        const elementIndex2 = this.sourceItemsB.find((obj => obj.id == this.seleccionadoB));
        this.targetItemsB.push(elementIndex2);
        this.hideModalDialogB();
      }
    }

    terminarJuego():void{
      this.validacionIncorrecta = false;
      if(!this.informeArbitralValue){
        this.validacionIncorrecta = true;
        this.mensajeInformeArbitral = this.labels.CAMPO_OBLIGATORIO_LABEL;
      }
      if(!this.validacionIncorrecta){
        this.equipoAGuardar = new Equipo();
        this.equipoAGuardar = this.equipoA;
        this.equipoBGuardar = new Equipo();
        this.equipoBGuardar = this.equipoB;
        this.detallePartidoGuardar = new DetallePartido();
        this.detallePartidoGuardar.equipoa = this.equipoA;
        this.detallePartidoGuardar.equipob = this.equipoB;
        this.detallePartidoGuardar.fecha = moment(this.fechaEncuentro);
        this.detallePartidoGuardar.hora = this.horaEncuentro.toString();
        this.detallePartidoGuardar.anotacionesa = this.anotacionesA;
        this.detallePartidoGuardar.anotacionesb = this.anotacionesB;
        this.detallePartidoGuardar.arbitro = this.arbitroValue;
        this.detallePartidoGuardar.campeonato = this.torneoValue;
        this.detallePartidoGuardar.juez1 = this.juez1Value;
        this.detallePartidoGuardar.juez2 = this.juez2Value;
        this.detallePartidoGuardar.informeArbitral = this.informeArbitralValue;
        this.detallePartidoGuardar.categoria = this.listaCategorias.find(categoria => categoria.codigo === this.torneoValue.categoria).nombre;
        this.detallePartidoGuardar.fase = this.fase;
        this.detallePartidoGuardar.jornada = this.jornada;
        if(this.anotacionesA > this.anotacionesB){
          if(this.torneoValue.deporte == 1 || this.torneoValue.deporte == 3){
            this.equipoAGuardar.puntos = this.equipoAGuardar.puntos + 3;
          }
          else if(this.torneoValue.deporte == 2){
            this.equipoAGuardar.puntos = this.equipoAGuardar.puntos + 2;
          }
          this.detallePartidoGuardar.equipoGanador = this.equipoA.nombre;
        }else if(this.anotacionesA < this.anotacionesB){
          if(this.torneoValue.deporte == 1 || this.torneoValue.deporte == 3){
            this.equipoBGuardar.puntos = this.equipoBGuardar.puntos + 3;
          }
          else if(this.torneoValue.deporte == 2){
            this.equipoBGuardar.puntos = this.equipoBGuardar.puntos + 2;
          }
          if(this.anotacionesA < this.anotacionesB){
            this.detallePartidoGuardar.equipoGanador = this.equipoB.nombre;
          }
        }else{
          this.equipoAGuardar.puntos = this.equipoAGuardar.puntos + 1;
          this.equipoBGuardar.puntos = this.equipoBGuardar.puntos + 1;
        }
        
        this.confirmationService.confirm({
          message: 'Seguro desea terminar el partido?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Si',
          rejectLabel: 'No',
          accept: () => {
            this.detallePartidoService.create(this.detallePartidoGuardar, this.tokenUser).subscribe(
              data => {
                this.equipoService.update(this.equipoAGuardar, this.tokenUser).subscribe(() =>{});
                this.equipoService.update(this.equipoBGuardar, this.tokenUser).subscribe(() =>{});
                this.showSuccess();
                this.router.navigate(['/']);
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
                this.showError();
              }
            );
          },
          reject: () => {
          }
        });
      }
    }

    showSuccess() {
      this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Partido guardado correctamente'});
    }

    showError() {
      this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo guardar el partido'});
    }

    showErrorTitularesA() {
      this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'El rango de jugadores titurales del equipo ' + this.equipoA.nombre +' deben estar entre 7 y 11'});
    }

    showErrorTitularesB() {
      this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'El rango de jugadores titurales del equipo ' + this.equipoB.nombre +' deben estar entre 7 y 11'});
    }

    showErrorTitularesAB() {
      this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'El rango de jugadores titurales del equipo ' + this.equipoA.nombre +' deben estar entre 3 y 5'});
    }

    showErrorTitularesBB() {
      this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'El rango de jugadores titurales del equipo ' + this.equipoB.nombre +' deben estar entre 3 y 5'});
    }

    showErrorTokenExpired() {
      this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'Token Expirado debe iniciar sesión'});
    }

    startTimer() {
      this.pausar = false;
      this.reanudar = true;
      this.interval = setInterval(() => {
        if(this.cronoSeg < 59){
          this.cronoSeg++;
        }else{
          this.cronoMin++;
          this.cronoSeg = 0;
        }
      },1000)
    }
  
    pauseTimer() {
      this.pausar = true;
      this.reanudar = false;
      clearInterval(this.interval);
    }

    initTimer(){
      this.cronoSeg = 0;
      this.cronoMin = 0;
      this.startTimer();
      this.empezar = true;
    }

    restartTimer(){
      this.cronoSeg = 0;
      this.cronoMin = 0;
    }

    anotarGol(item:any, equipo:any){
      let elementIndex: any;
      if(equipo == 1){
        elementIndex = this.titularesEquipoB.find((obj => obj.posicion == "portero"));
      }
      else{
        elementIndex = this.titularesEquipoA.find((obj => obj.posicion == "portero"));
      }
      this.confirmationService.confirm({
        message: 'Seguro desea registrar el gol a '+item.nombre+'?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.deportistaService.getDeportista(item.id,this.tokenUser).subscribe(deportista => {
              deportista.anotaciones = deportista.anotaciones + 1;
              if(equipo == 1){
                this.anotacionesA = this.anotacionesA + 1;
              }
              else{
                this.anotacionesB = this.anotacionesB + 1;
              }
              this.deportistaService.getDeportista(elementIndex.id,this.tokenUser).subscribe(portero => {
                portero.golesRecibidos = portero.golesRecibidos + 1;
                this.deportistaService.update(portero,this.tokenUser).subscribe(() => {}); 
              });
              this.deportistaService.update(deportista,this.tokenUser).subscribe(() => {});
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
              this.showError();
            }
          );
        },
        reject: () => {
        }
      });
    }

    quitarGol(item:any, equipo:any){
      let elementIndex: any;
      if(equipo == 1){
        elementIndex = this.titularesEquipoB.find((obj => obj.posicion == "portero"));
      }
      else{
        elementIndex = this.titularesEquipoA.find((obj => obj.posicion == "portero"));
      }
      this.confirmationService.confirm({
        message: 'Seguro desea quitar el gol a '+item.nombre+'?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.deportistaService.getDeportista(item.id,this.tokenUser).subscribe(deportista => {
              deportista.anotaciones = deportista.anotaciones - 1;
              if(equipo == 1){
                this.anotacionesA = this.anotacionesA - 1;
              }
              else{
                this.anotacionesB = this.anotacionesB - 1;
              }
              this.deportistaService.getDeportista(elementIndex.id,this.tokenUser).subscribe(portero => {
                portero.golesRecibidos = portero.golesRecibidos - 1;
                this.deportistaService.update(portero,this.tokenUser).subscribe(() => {}); 
              });
              this.deportistaService.update(deportista,this.tokenUser).subscribe(() => {});
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
              this.showError();
            }
          );
        },
        reject: () => {
        }
      });
    }

    anotarTarjetaAmarilla(item:any, equipo:any){
      let elementIndex = 0;
      if(equipo == 1){
        elementIndex = this.titularesEquipoA.findIndex((obj => obj.id == item.id));
      }
      else{
        elementIndex = this.titularesEquipoB.findIndex((obj => obj.id == item.id));
      }
      this.confirmationService.confirm({
        message: 'Seguro desea registrar la tarjeta amarilla a '+item.nombre+'?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          if(equipo == 1){
            this.titularesEquipoA[elementIndex].checkedTA = true;
            this.titularesEquipoA[elementIndex].checkedDobleTA = false;
          }
          else{
            this.titularesEquipoB[elementIndex].checkedTA = true;
            this.titularesEquipoB[elementIndex].checkedDobleTA = false;
          }
        },
        reject: () => {
        }
      });
    }

    quitarTarjetaAmarilla(item:any, equipo:any){
      let elementIndex = 0;
      if(equipo == 1){
        elementIndex = this.titularesEquipoA.findIndex((obj => obj.id == item.id));
      }
      else{
        elementIndex = this.titularesEquipoB.findIndex((obj => obj.id == item.id));
      }
      this.confirmationService.confirm({
        message: 'Seguro desea quitar la tarjeta amarilla a '+item.nombre+'?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          if(equipo == 1){
            this.titularesEquipoA[elementIndex].checkedTA = false;
            this.titularesEquipoA[elementIndex].checkedDobleTA = true;
          }
          else{
            this.titularesEquipoB[elementIndex].checkedTA = false;
            this.titularesEquipoB[elementIndex].checkedDobleTA = true;
          }
        },
        reject: () => {
        }
      });
    }

    anotarDobleTarjetaAmarilla(item:any, equipo:any){
      let elementIndex = 0;
      if(equipo == 1){
        elementIndex = this.titularesEquipoA.findIndex((obj => obj.id == item.id));
      }
      else{
        elementIndex = this.titularesEquipoB.findIndex((obj => obj.id == item.id));
      }
      this.confirmationService.confirm({
        message: 'Seguro desea registrar la doble tarjeta amarilla a '+item.nombre+'?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          if(equipo == 1){
            this.titularesEquipoA[elementIndex].checkedTR = true;
            this.titularesEquipoA[elementIndex].checkedDobleTA = true;
            this.titularesEquipoA[elementIndex].checkedGol = true;
            this.titularesEquipoA[elementIndex].isValidDobleTA = true;
          }
          else{
            this.titularesEquipoB[elementIndex].checkedTR = true;
            this.titularesEquipoB[elementIndex].checkedDobleTA = true;
            this.titularesEquipoB[elementIndex].checkedGol = true;
            this.titularesEquipoB[elementIndex].isValidDobleTA = true;
          }
        },
        reject: () => {
        }
      });
    }

    quitarDobleTarjetaAmarilla(item:any, equipo:any){
      let elementIndex = 0;
      if(equipo == 1){
        elementIndex = this.titularesEquipoA.findIndex((obj => obj.id == item.id));
      }
      else{
        elementIndex = this.titularesEquipoB.findIndex((obj => obj.id == item.id));
      }
      this.confirmationService.confirm({
        message: 'Seguro desea quitar la doble tarjeta amarilla a '+item.nombre+'?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          if(equipo == 1){
            this.titularesEquipoA[elementIndex].checkedTR = false;
            this.titularesEquipoA[elementIndex].checkedDobleTA = false;
            this.titularesEquipoA[elementIndex].checkedGol = false;
            this.titularesEquipoA[elementIndex].isValidDobleTA = false;
          }
          else{
            this.titularesEquipoB[elementIndex].checkedTR = false;
            this.titularesEquipoB[elementIndex].checkedDobleTA = false;
            this.titularesEquipoB[elementIndex].checkedGol = false;
            this.titularesEquipoB[elementIndex].isValidDobleTA = false;
          }
        },
        reject: () => {
        }
      });
    }

    anotarTarjetaRoja(item:any, equipo:any){
      let elementIndex = 0;
      if(equipo == 1){
        elementIndex = this.titularesEquipoA.findIndex((obj => obj.id == item.id));
      }
      else{
        elementIndex = this.titularesEquipoB.findIndex((obj => obj.id == item.id));
      }
      this.confirmationService.confirm({
        message: 'Seguro desea registrar la tarjeta roja a '+item.nombre+'?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          if(equipo == 1){
            this.titularesEquipoA[elementIndex].checkedTR = true;
            this.titularesEquipoA[elementIndex].checkedTA = true;
            this.titularesEquipoA[elementIndex].checkedDobleTA = true;
            this.titularesEquipoA[elementIndex].checkedGol = true;
            this.titularesEquipoA[elementIndex].isValidDobleTA = true;
          }
          else{
            this.titularesEquipoB[elementIndex].checkedTR = true;
            this.titularesEquipoA[elementIndex].checkedTA = true;
            this.titularesEquipoA[elementIndex].checkedDobleTA = true;
            this.titularesEquipoB[elementIndex].checkedGol = true;
            this.titularesEquipoB[elementIndex].isValidDobleTA = true;
          }
        },
        reject: () => {
        }
      });
    }

    quitarTarjetaRoja(item:any, equipo:any){
      let elementIndex = 0;
      if(equipo == 1){
        elementIndex = this.titularesEquipoA.findIndex((obj => obj.id == item.id));
      }
      else{
        elementIndex = this.titularesEquipoB.findIndex((obj => obj.id == item.id));
      }
      this.confirmationService.confirm({
        message: 'Seguro desea quitar la tarjeta roja a '+item.nombre+'?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          if(equipo == 1){
            this.titularesEquipoA[elementIndex].checkedTR = false;
            this.titularesEquipoA[elementIndex].checkedTA = false;
            this.titularesEquipoA[elementIndex].checkedDobleTA = false;
            this.titularesEquipoA[elementIndex].checkedGol = false;
            this.titularesEquipoA[elementIndex].isValidDobleTA = false;
          }
          else{
            this.titularesEquipoB[elementIndex].checkedTR = false;
            this.titularesEquipoA[elementIndex].checkedTA = false;
            this.titularesEquipoA[elementIndex].checkedDobleTA = false;
            this.titularesEquipoB[elementIndex].checkedGol = false;
            this.titularesEquipoB[elementIndex].isValidDobleTA = false;
          }
        },
        reject: () => {
        }
      });
    }

    anotarCesta(item:any, equipo:any, punto:any){
      this.confirmationService.confirm({
        message: 'Seguro desea registrar la cesta de '+punto+' puntos a '+item.nombre+'?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.deportistaService.getDeportista(item.id,this.tokenUser).subscribe(deportista => {
              deportista.cestas = deportista.cestas + punto;
              if(equipo == 1){
                this.anotacionesA = this.anotacionesA + punto;
              }
              else{
                this.anotacionesB = this.anotacionesB + punto;
              }
              this.deportistaService.update(deportista,this.tokenUser).subscribe(() => {});
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
              this.showError();
            }
          );
        },
        reject: () => {
        }
      });
    }

    quitarCesta(item:any, equipo:any, punto:any){
      this.confirmationService.confirm({
        message: 'Seguro desea quitar la cesta de '+punto+' puntos a '+item.nombre+'?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.deportistaService.getDeportista(item.id,this.tokenUser).subscribe(deportista => {
              deportista.cestas = deportista.cestas - punto;
              if(equipo == 1){
                this.anotacionesA = this.anotacionesA - punto;
              }
              else{
                this.anotacionesB = this.anotacionesB - punto;
              }
              this.deportistaService.update(deportista,this.tokenUser).subscribe(() => {});
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
              this.showError();
            }
          );
        },
        reject: () => {
        }
      });
    }

    anotarFalta(item:any, equipo:any){
      let elementIndex = 0;
      if(equipo == 1){
        elementIndex = this.titularesEquipoA.findIndex((obj => obj.id == item.id));
      }
      else{
        elementIndex = this.titularesEquipoB.findIndex((obj => obj.id == item.id));
      }
      this.confirmationService.confirm({
        message: 'Seguro desea registrar la falta al jugador a '+item.nombre+'?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
            if(equipo == 1){
              this.titularesEquipoA[elementIndex].numFaltas += 1;
              this.faltasABA= this.faltasABA + 1;
            }
            else{
              this.titularesEquipoB[elementIndex].numFaltas += 1;
              this.faltasBBA= this.faltasBBA + 1;
            }
          },
          reject: () => {
          }
      });
    }

    quitarFalta(item:any, equipo:any){
      let elementIndex = 0;
      if(equipo == 1){
        elementIndex = this.titularesEquipoA.findIndex((obj => obj.id == item.id));
      }
      else{
        elementIndex = this.titularesEquipoB.findIndex((obj => obj.id == item.id));
      }
      this.confirmationService.confirm({
        message: 'Seguro desea quitar la falta al jugador a '+item.nombre+'?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
            if(equipo == 1){
              this.titularesEquipoA[elementIndex].numFaltas -= 1;
              this.faltasABA= this.faltasABA - 1;
            }
            else{
              this.titularesEquipoB[elementIndex].numFaltas -= 1;
              this.faltasBBA= this.faltasBBA - 1;
            }
          },
          reject: () => {
          }
      });
    }

    cambiarPeriodo(event:any){
      if(this.periodoActual != event){
        this.periodoActual = event;
        this.faltasABA = 0;
        this.faltasBBA = 0;
      }
    }

    contarJugadores(event:any){
      this.validacionIncorrecta = false;
      this.numeroMaximoTitularesFutbolA = false;
      this.numeroMinimoTitularesFutbolB = false;
      this.numeroMaximoTitularesFutbolB = false;
      this.numeroMinimoTitularesFutbolA = false;
      this.numeroMinimoTitularesBaloncestoA = false;
      this.numeroMaximoTitularesBaloncestoA = false;
      this.numeroMinimoTitularesBaloncestoB = false;
      this.numeroMaximoTitularesBaloncestoB = false;
      this.numeroMinimoTitularesFutbolSalaA = false;
      this.numeroMaximoTitularesFutbolSalaA = false;
      this.numeroMinimoTitularesFutbolSalaB = false;
      this.numeroMaximoTitularesFutbolSalaB = false;
      if(this.torneoValue.deporte == 1){
        if(this.targetItemsA.length > 11){
          this.numeroMinimoTitularesFutbolA = false;
          this.numeroMaximoTitularesFutbolA = true;
          this.mensajeMinimoTitularesFutbolA = "";
          this.validacionIncorrecta = true;
          this.mensajeMaximoTitularesFutbolA = "Excedio el número máximo de jugadores permitidos que es 11"
        }
        if(this.targetItemsB.length > 11){
          this.numeroMaximoTitularesFutbolB = true;
          this.numeroMinimoTitularesFutbolB = false;
          this.validacionIncorrecta = true;
          this.mensajeMinimoTitularesFutbolB = "";
          this.mensajeMaximoTitularesFutbolB = "Excedio el número máximo de jugadores permitidos que es 11"
        }
        if(this.targetItemsA.length < 7){
          this.numeroMaximoTitularesFutbolA = false;
          this.numeroMinimoTitularesFutbolA = true;
          this.validacionIncorrecta = true;
          this.mensajeMaximoTitularesFutbolA = "";
          this.mensajeMinimoTitularesFutbolA = "Deben existir mínimo 7 jugadores titulares";
        }
        if(this.targetItemsB.length < 7){
          this.numeroMaximoTitularesFutbolB = false;
          this.numeroMinimoTitularesFutbolB = true;
          this.validacionIncorrecta = true;
          this.mensajeMaximoTitularesFutbolB = "";
          this.mensajeMinimoTitularesFutbolB = "Deben existir mínimo 7 jugadores titulares";
        }
      }
      else if(this.torneoValue.deporte == 2){
        if(this.targetItemsA.length > 5){
          this.numeroMinimoTitularesBaloncestoA = false;
          this.numeroMaximoTitularesBaloncestoA = true;
          this.mensajeMinimoTitularesBaloncestoA = "";
          this.validacionIncorrecta = true;
          this.mensajeMaximoTitularesBaloncestoA = "Excedio el número máximo de jugadores permitidos que es 5"
        }
        if(this.targetItemsB.length > 5){
          this.numeroMaximoTitularesBaloncestoB = true;
          this.numeroMinimoTitularesBaloncestoB = false;
          this.validacionIncorrecta = true;
          this.mensajeMinimoTitularesBaloncestoB = "";
          this.mensajeMaximoTitularesBaloncestoB = "Excedio el número máximo de jugadores permitidos que es 5"
        }
        if(this.targetItemsA.length < 3){
          this.numeroMaximoTitularesBaloncestoA = false;
          this.numeroMinimoTitularesBaloncestoA = true;
          this.validacionIncorrecta = true;
          this.mensajeMaximoTitularesBaloncestoA = "";
          this.mensajeMinimoTitularesBaloncestoA = "Deben existir mínimo 3 jugadores titulares";
        }
        if(this.targetItemsB.length < 3){
          this.numeroMaximoTitularesBaloncestoB = false;
          this.numeroMinimoTitularesBaloncestoB = true;
          this.validacionIncorrecta = true;
          this.mensajeMaximoTitularesBaloncestoB = "";
          this.mensajeMinimoTitularesBaloncestoB = "Deben existir mínimo 3 jugadores titulares";
        }
      }
      if(this.torneoValue.deporte == 3){
        if(this.targetItemsA.length > 5){
          this.numeroMinimoTitularesFutbolSalaA = false;
          this.numeroMaximoTitularesFutbolSalaA = true;
          this.mensajeMinimoTitularesFutbolSalaA = "";
          this.validacionIncorrecta = true;
          this.mensajeMaximoTitularesFutbolSalaA = "Excedio el número máximo de jugadores permitidos que es 5"
        }
        if(this.targetItemsB.length > 5){
          this.numeroMaximoTitularesFutbolSalaB = true;
          this.numeroMinimoTitularesFutbolSalaB = false;
          this.validacionIncorrecta = true;
          this.mensajeMinimoTitularesFutbolSalaB = "";
          this.mensajeMaximoTitularesFutbolSalaB = "Excedio el número máximo de jugadores permitidos que es 5"
        }
        if(this.targetItemsA.length < 3){
          this.numeroMaximoTitularesFutbolSalaA = false;
          this.numeroMinimoTitularesFutbolSalaA = true;
          this.validacionIncorrecta = true;
          this.mensajeMaximoTitularesFutbolSalaA = "";
          this.mensajeMinimoTitularesFutbolSalaA = "Deben existir mínimo 3 jugadores titulares";
        }
        if(this.targetItemsB.length < 3){
          this.numeroMaximoTitularesFutbolSalaB = false;
          this.numeroMinimoTitularesFutbolSalaB = true;
          this.validacionIncorrecta = true;
          this.mensajeMaximoTitularesFutbolSalaB = "";
          this.mensajeMinimoTitularesFutbolSalaB = "Deben existir mínimo 3 jugadores titulares";
        }
      }
    }

}