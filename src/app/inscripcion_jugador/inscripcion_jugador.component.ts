import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Equipo, IEquipo } from "src/models/equipo.model";
import { EquipoService } from "src/services/equipo.service";
import { commonMessages } from "src/shared/constants/commonMessages";
import { IlistarDeportistas, IlistarEquipos, IOpcionVo } from "src/shared/vo/opcion-vo";
import { Deportista, IDeportista } from 'src/models/deportista.model';
import * as moment from "moment";
import { ConfirmationService, MessageService } from "primeng/api";
import { DeportistaService } from "src/services/deportista.service";
import { EquipoDeportista } from "src/models/equipodeportista.model";
import { ActivatedRoute, Router } from "@angular/router";
import { Campeonato } from "src/models/campeonato.model";
import { CampeonatoService } from "src/services/campeonato.service";
import { EquipoDeportistaService } from "src/services/equipoDeportista.service";
import { TokenStorageService } from "src/services/tokenStorage.service";
import { FileUpload } from "primeng/fileupload";


@Component({
    selector: 'inscripcion_jugador',
    templateUrl: './inscripcion_jugador.component.html',
    styleUrls: ['./inscripcion_jugador.component.scss']
})
export class InscripcionJugadorComponent implements OnInit{
    @ViewChild('fileFotoDeportista') fileFotoDeportista!: FileUpload;
    formDatosJugador!: FormGroup;
    formDatosJugadorEditar!: FormGroup;
    date: Date[];
    uploadedFiles: any[] = [];
    labels = commonMessages;
    mensajeFechaNacimiento:any;
    mensajeFotoDeportista:any;
    mensajeIdEquipo:any;
    listaTipoIdentificacion: IOpcionVo[] = commonMessages.ARRAY_IDENTIFICACIONES;
    listaEquipos: Array<IEquipo> = [];
    selectedValue: string = 'NO';
    validacionIncorrecta = false;
    deportista!: Deportista;
    equipoDeportista!: EquipoDeportista;
    baseImagen: any;
    baseDocument: any;
    listaDeportistasMostrar: Array<IlistarDeportistas> = [];
    listaDeportistas: Array<IDeportista> = [];
    userDeportista: any;
    displayModalDeportista: boolean;
    idTorneo = 0;
    campeonato! : Campeonato;
    equipoDeportistaMostrar!: EquipoDeportista;
    tokenUser = "";
    user:any;
    equipoGuardar!: Equipo;
    deporteTorneo = 0;
    fechaNacimiento:Date;
    value:any;
    fileFoto: File;
    readerFoto = new FileReader();
    
    constructor(
        private fb: FormBuilder,
        private equipoService: EquipoService,
        private confirmationService: ConfirmationService,
        private deportistaService: DeportistaService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private campeonatoService: CampeonatoService,
        private equipoDeportistaService: EquipoDeportistaService,
        private tokenStorage: TokenStorageService,
        private router: Router
      ) {
    }

    ngOnInit(): void {
      if(this.tokenStorage.getToken()){
        this.tokenUser = this.tokenStorage.getToken();
        this.user = this.tokenStorage.getUser();
      }
      const param = this.route.snapshot.queryParamMap.get('torneo')!;
      this.idTorneo = parseInt(param, 10);
      this.cargarCampeonato(this.idTorneo);
      this.crearFormularioJugador();
      this.cargarEquipos(this.user);
      this.crearFormularioJugadorEditar();
    }

    cargarCampeonato(idTorneo: number): void{
      this.campeonatoService.getCampeonato(idTorneo).subscribe(torneo => {
        this.campeonato = torneo;
        this.deporteTorneo = this.campeonato.deporte;
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

    hideModalDialog() {
      this.displayModalDeportista = false;
    }

    showSuccessEdit() {
      this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Deportista editado correctamente'});
    }

    showErrorEdit() {
      this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo editar el deportista'});
    }

    showSuccessDelete() {
      this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Deportista eliminado correctamente'});
    }

    showErrorDelete() {
      this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo eliminar el deportista'});
    }
  
    showModalDialogDeportista(deportista:any) : void{
      this.userDeportista = deportista;
      this.equipoDeportistaService.getEquipoDeportistaByCampeonato(this.idTorneo,this.userDeportista.id, this.tokenUser).subscribe(response => {
        this.equipoDeportistaMostrar = response[0];
        this.cargarFormularioDeportista();
        this.displayModalDeportista = true;
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

    cargarFormularioDeportista(): void {
      if(this.userDeportista){
        this.formDatosJugadorEditar.patchValue({
          id: this.userDeportista.id,
          identificacion: this.userDeportista.identificacion,
          tipoIdentificacion: Number(this.userDeportista.tipoIdentificacion),
          nombreJugador: this.userDeportista.nombre,
          apellidoJugador: this.userDeportista.apellido,
          fechaNacimiento: this.userDeportista.fechaNacimiento,
          fotoDeportista: this.userDeportista.fotoDeportista,
          idEquipo: this.equipoDeportistaMostrar.idEquipo.id.toString(),
          posicion: this.userDeportista.posicion,
          documento: this.userDeportista.documento
        });
      }
    }

    crearFormularioJugadorEditar(): void {
        this.formDatosJugadorEditar = this.fb.group({
            id: [''],
            identificacion: ['',[Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
            tipoIdentificacion: ['',[Validators.required]],
            nombreJugador: ['',[Validators.required]],
            apellidoJugador: ['',[Validators.required]],
            fechaNacimiento: ['',[Validators.required]],
            fotoDeportista: [''],
            idEquipo: [''],
            posicion: [''],
            golesRecibidos: [''],
            anotaciones: [''],
            documento: ['']
        });
    }

    crearFormularioJugador(): void {
        this.formDatosJugador = this.fb.group({
            id: [''],
            identificacion: ['',[Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
            tipoIdentificacion: ['',[Validators.required]],
            nombreJugador: ['',[Validators.required]],
            apellidoJugador: ['',[Validators.required]],
            fechaNacimiento: ['',[Validators.required]],
            fotoDeportista: [''],
            idEquipo: [''],
            posicion: [''],
            golesRecibidos: [''],
            anotaciones: [''],
            documento: ['',[Validators.required]]
        });
    }

    agregarJugador(): void{
      this.equipoDeportista = new EquipoDeportista();
      this.validacionIncorrecta = false;
      this.mensajeFechaNacimiento = "";
      this.mensajeFotoDeportista = "";
      this.mensajeIdEquipo = "";
      this.deportista = new Deportista();
      this.deportista.nombre = this.formDatosJugador.controls['nombreJugador'].value;
      this.deportista.apellido = this.formDatosJugador.controls['apellidoJugador'].value;
      this.deportista.tipoIdentificacion = this.formDatosJugador.controls['tipoIdentificacion'].value;
      this.deportista.identificacion = this.formDatosJugador.controls['identificacion'].value;
      this.deportista.fechaNacimiento = moment(this.formDatosJugador.controls['fechaNacimiento'].value);
      if(this.deporteTorneo != 2)
      this.deportista.posicion = this.formDatosJugador.controls['posicion'].value;
      this.deportista.documento = this.baseDocument;
      this.deportista.anotaciones = 0;
      this.deportista.golesRecibidos = 0;
      this.deportista.cestas = 0;
      if(this.deporteTorneo == 2){
        this.deportista.posicion = "jugador";
      }
      if(!this.deportista.fechaNacimiento.isValid()){
        this.mensajeFechaNacimiento = this.labels.CAMPO_OBLIGATORIO_LABEL;
        this.validacionIncorrecta = true;
      }   
      if (this.validacionIncorrecta === false) {
        this.confirmationService.confirm({
          message: 'Seguro desea agregar el deportista?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Si',
          rejectLabel: 'No',
          accept: () => {
            this.deportista.fotoDeportista = this.baseImagen;
            this.equipoDeportista.idDeportista = this.deportista;
            this.equipoDeportista.idEquipo = this.equipoGuardar;
            this.equipoDeportista.idCampeonato = this.campeonato;
            this.deportistaService.create(this.equipoDeportista, this.tokenUser).subscribe(
              data => {
                if (data!== null) {
                  this.showSuccess();
                  this.cargarDeportistas();
                  this.limpiarCampos();
                }
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
                this.showErrorWithMessage(err.error);
              }
            );
          },
          reject: () => {
          }
        });
      }
    }

    async upload(event:any): Promise<any> {
      if (event.files.length) {
        this.uploadedFiles = event.files;
      }
      this.baseImagen = await this.getBase64(event.files[0]);
    }    

    cargarImagen(event: any): void {
      this.fileFoto= event.target.files[0];
      this.readerFoto.readAsDataURL(this.fileFoto);
      this.readerFoto.onload = () => {
        this.baseDocument = this.readerFoto.result;        
      };
    }

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

    cargarEquipos(user:any): void{
      this.equipoService.getEquipoByDelegado(user.user_id, this.idTorneo, this.tokenUser).subscribe(equipo => {
        this.equipoGuardar = equipo[0];
        this.cargarDeportistas();
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

    showSuccess() {
      this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Jugador agregado correctamente'});
    }

    limpiarCampos():void{
      this.uploadedFiles = [];
      this.baseImagen = "";
      this.fileFoto = null;
      this.readerFoto = null;
      this.fileFotoDeportista.clear();
      this.formDatosJugador.reset();
    }

    limpiarCamposEditar():void{
      this.formDatosJugadorEditar.reset();
    }

    showError() {
      this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo agregar el jugador'});
    }

    showErrorTokenExpired() {
      this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'Token Expirado debe iniciar sesión'});
    }

    showErrorWithMessage(mensaje:any) {
      this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: mensaje});
    }

    cargarDeportistas():void{
      this.listaDeportistasMostrar = [];
      this.equipoDeportistaService.getEquipoDeportistaByEquipo(this.equipoGuardar.id, this.idTorneo, this.tokenUser).subscribe(data => {
        if(data.length > 0){
          data.forEach(element => {
            this.listaDeportistasMostrar.push({
              id: element.idDeportista.id.toString(),
              tipoIdentificacion: element.idDeportista.tipoIdentificacion.toString(),
              identificacion: element.idDeportista.identificacion,
              nombre: element.idDeportista.nombre,
              apellido: element.idDeportista.apellido,
              fechaNacimiento: element.idDeportista.fechaNacimiento.toString(),
              fotoDeportista: element.idDeportista.fotoDeportista,
              posicion: element.idDeportista.posicion,
              equipo: element.idEquipo.nombre,
              documento: element.idDeportista.documento
            });
          });
        } 
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
      });
    }

    editarDeportista(): void{
      this.equipoDeportista = new EquipoDeportista();
      this.validacionIncorrecta = false;
      this.mensajeFechaNacimiento = "";
      this.mensajeFotoDeportista = "";
      this.mensajeIdEquipo = "";
      this.deportista = new Deportista();
      this.deportista.id = this.userDeportista.id;
      this.deportista.nombre = this.formDatosJugadorEditar.controls['nombreJugador'].value;
      this.deportista.apellido = this.formDatosJugadorEditar.controls['apellidoJugador'].value;
      this.deportista.tipoIdentificacion = this.formDatosJugadorEditar.controls['tipoIdentificacion'].value;
      this.deportista.identificacion = this.formDatosJugadorEditar.controls['identificacion'].value;
      this.deportista.fechaNacimiento = moment(this.formDatosJugadorEditar.controls['fechaNacimiento'].value);

      if(this.deporteTorneo != 2)
      this.deportista.posicion = this.formDatosJugadorEditar.controls['posicion'].value;

      this.deportista.documento = this.userDeportista.documento;
      this.deportista.anotaciones = this.equipoDeportistaMostrar.idDeportista.anotaciones;
      this.deportista.golesRecibidos = this.equipoDeportistaMostrar.idDeportista.golesRecibidos;
      this.deportista.cestas = this.equipoDeportistaMostrar.idDeportista.cestas;
      if(this.deporteTorneo == 2){
        this.deportista.posicion = "jugador";
      }
      /*if(!this.deportista.fechaNacimiento.isValid()){
        console.log("entro 5");
        this.mensajeFechaNacimiento = this.labels.CAMPO_OBLIGATORIO_LABEL;
        this.validacionIncorrecta = true;
      }*/
      console.log("valida");
      console.log(this.validacionIncorrecta);
      
      if (this.validacionIncorrecta === false) {
        this.confirmationService.confirm({
          message: 'Seguro desea editar el deportista?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Si',
          rejectLabel: 'No',
          accept: () => {
            this.deportista.fotoDeportista = this.userDeportista.fotoDeportista;
            this.equipoDeportista.idDeportista = this.deportista;
            this.equipoDeportista.idEquipo = this.equipoGuardar;
            this.equipoDeportista.idCampeonato = this.campeonato;
            this.deportistaService.update(this.deportista, this.tokenUser).subscribe(
              data => {
                if (data!== null) {
                  this.listaDeportistasMostrar = [];
                  this.cargarDeportistas();
                  this.crearFormularioJugadorEditar();
                  this.hideModalDialog();
                  this.showSuccessEdit();
                  this.limpiarCamposEditar();
                }
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
                this.showErrorEdit();
              }
            );
          },
          reject: () => {
          }
        });
      }
    }

    eliminarDeportista(deportista: any): void{
      this.confirmationService.confirm({
        message: 'Seguro desea eliminar el deportista, con toda la información relacionada?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.deportistaService.delete(deportista.id, this.tokenUser).subscribe(
            data => {
              this.showSuccessDelete();
              this.cargarDeportistas();
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

    descargarDocumento(deportista: any): void{
      const source = `${deportista.documento}`;
      const link = document.createElement("a");
      link.href = source;
      link.download = `${deportista.nombre}.pdf`
      link.click();
    }
}