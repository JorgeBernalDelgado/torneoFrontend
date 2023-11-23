import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Campeonato, ICampeonato } from 'src/models/campeonato.model';
import { CampeonatoService } from 'src/services/campeonato.service';
import { commonMessages } from 'src/shared/constants/commonMessages';
import { IlistarCampeonatos, IOpcionVo, IlistarGrupos } from 'src/shared/vo/opcion-vo';
import { ConfirmationService, MessageService} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/services/tokenStorage.service';
import { GrupoService } from 'src/services/grupo.service';
import { IDatos } from 'src/models/datos.model';
import { DatosService } from 'src/services/datos.service';

@Component({
  selector: 'torneos',
  templateUrl: './torneos.component.html',
  styleUrls: ['./torneos.component.scss']
})
export class TorneosComponent implements OnInit{
  displayModal: boolean;
  formDatosCampeonato!: FormGroup;
  listaCampeonatos: Array<ICampeonato> = [];
  listaCampeonatosMostrar: Array<IlistarCampeonatos> = [];
  deportes: IOpcionVo[] = commonMessages.ARRAY_DEPORTES;
  categorias: Array<IDatos> = [];
  categoriasValue: Array<IDatos> = [];
  localidades: IOpcionVo[] = commonMessages.ARRAY_LOCALIDADES;
  rango_annios: IOpcionVo[] = commonMessages.ARRAY_ANNIOS;
  planillas: IOpcionVo[] = commonMessages.ARRAY_PLANILLAS;
  divisiones: IOpcionVo[] = commonMessages.ARRAY_DIVISIONES;
  rutaImagenFutbol = "assets/img/emoticon_futbol.jpg";
  rutaImagenBasket = 'assets/img/emoticon_basket.jpg';
  rutaImagenFutsala = 'assets/img/emoticon_micro.jpg';
  labels = commonMessages;
  deportesValue: IOpcionVo[] = commonMessages.ARRAY_DEPORTES;
  ramasValue: IOpcionVo[] = commonMessages.ARRAY_RAMAS;
  localidadesValue: IOpcionVo[] = commonMessages.ARRAY_LOCALIDADES;
  rangoAnniosValue: IOpcionVo[] = commonMessages.ARRAY_ANNIOS;
  planillasValue: IOpcionVo[] = commonMessages.ARRAY_PLANILLAS;
  divisionesValue: IOpcionVo[] = commonMessages.ARRAY_DIVISIONES;
  campeonato!: Campeonato;
  closeModal: string
  cargoDatos = false;
  validacionIncorrecta = false;
  listacarnet: IOpcionVo[] = commonMessages.ARRAY_CARNET;
  valueUser = 1;
  valor: any;
  usuarioEnSesion: any;
  tokenUser = "";
  inputTextNombreTorneo: string = "";

  constructor(
    private campeonatoService: CampeonatoService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorageService,
    private grupoService: GrupoService,
    private confirmationService: ConfirmationService,
    private datosService: DatosService
  ) {
  }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()){
      this.tokenUser = this.tokenStorage.getToken();
    }
    this.crearFormularioCampeonato();
    const param = this.route.snapshot.queryParamMap.get('valor')!;
    this.valor = param;
    this.usuarioEnSesion = JSON.parse(sessionStorage.getItem("auth-user"));
    this.validarSesion(this.usuarioEnSesion);
    this.cargarCategoria();
  }

  cargarCategoria(): void {
    this.datosService.getDatosByCategoria("categoria").subscribe(data => {
      data.forEach(element => {
        this.categorias.push({
          id: element.id,
          categoria: element.categoria,
          codigo: element.codigo,
          nombre: element.nombre 
        });
      });
      this.categoriasValue = this.categorias;
      setTimeout(() => {
        this.cargarCampeonatos();
      }, 1000); 
      
    });
  }

  validarSesion(usuario: any): void{
    if(usuario === null){
      this.usuarioEnSesion = {
        roles:{
          nombre:'ROL_GENERAL'
        }
      };
    }
  }

  showModalDialog() {
    this.displayModal = true;
  }

  hideModalDialog() {
    this.displayModal = false;
  }

  showSuccess() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Campeonato agregado correctamente'});
  }

  showError() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo agregar el campeonato'});
  }

  crearFormularioCampeonato(): void {
    this.formDatosCampeonato = this.fb.group({
      id: [''],
      nombreCampeonato: ['',[Validators.required]],
      deporte: ['',[Validators.required]],
      categoria: ['',[Validators.required]],
      rama: ['',[Validators.required]],
      localidad: ['',[Validators.required]],
      rangoAnnio: ['',[Validators.required]],
      planilla: ['',[Validators.required]],
      division: ['',[Validators.required]],
      carnet: ['',[Validators.required]],
      grupoCampeonato: ['',[Validators.required]]
    });
  }

  cargarCampeonatos(): void {
    console.log("categoria");
    console.log(this.categorias);
    
    this.listaCampeonatosMostrar = [];
    this.campeonatoService.getCampeonatos().subscribe( campeonatos => {
      this.listaCampeonatos = campeonatos;
      this.listaCampeonatos.forEach(element => {
        console.log("element");
        console.log(element);
        
        const deporte = this.deportes.find(deporte => deporte.codigo === element.deporte);
        const categoria = this.categorias.find(categoria => categoria.codigo === element.categoria);
        const localidad = this.localidades.find(localidad => localidad.codigo === element.localidad);
        const rango_annio = this.rango_annios.find(rango_annio => rango_annio.codigo === element.rangoAnnio);
        const planilla = this.planillas.find(planilla => planilla.codigo === element.planilla);
        const division = this.divisiones.find(division => division.codigo === element.division);
        const carnet = this.listacarnet.find(carnet => carnet.codigo === element.carnet);
        this.listaCampeonatosMostrar.push({
          id: element.id.toString(),
          nombre_campeonato: element.nombreCampeonato,
          estado: element.estado,
          deporte: deporte.nombre,
          categoria: categoria.nombre,
          rama: element.rama,
          localidad: localidad.nombre,
          rango_annio: rango_annio.nombre,
          planilla: planilla.nombre,
          division: division.nombre,
          carnet: carnet.nombre
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
    this.cargoDatos = true;
  }

  agregarCampeonato(): void {
    this.validacionIncorrecta = false;
    this.campeonato = new Campeonato();
    this.campeonato.nombreCampeonato = this.formDatosCampeonato.controls['nombreCampeonato'].value;
    this.campeonato.estado = "ACTIVO";
    this.campeonato.deporte = this.formDatosCampeonato.controls['deporte'].value;
    this.campeonato.categoria = this.formDatosCampeonato.controls['categoria'].value;
    this.campeonato.rama = this.formDatosCampeonato.controls['rama'].value;
    this.campeonato.localidad = this.formDatosCampeonato.controls['localidad'].value;
    this.campeonato.rangoAnnio = this.formDatosCampeonato.controls['rangoAnnio'].value;
    this.campeonato.planilla = this.formDatosCampeonato.controls['planilla'].value;
    this.campeonato.division = this.formDatosCampeonato.controls['division'].value;
    this.campeonato.carnet = this.formDatosCampeonato.controls['carnet'].value;
    if (this.validacionIncorrecta === false) {
      this.campeonatoService.create(this.campeonato,this.tokenUser).subscribe(
        data => {
          this.grupoService.createGrupos(this.campeonato.nombreCampeonato = this.formDatosCampeonato.controls['grupoCampeonato'].value,
                                            data.id,this.tokenUser).subscribe(() => {
            if (data!== null) {
              this.inputTextNombreTorneo = "";
              this.showSuccess();
              this.hideModalDialog();
              this.listaCampeonatosMostrar = [];
              this.cargarCampeonatos();
              this.limpiarCampos();
            }
          });
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
    }
  }

  limpiarCampos():void{
    this.formDatosCampeonato.reset();
  }

  verCampeonato(item:any):void{
    if(this.usuarioEnSesion.roles.nombre === 'ROL_ADMIN' && this.valor !== 'e' && this.valor !== 'c'){
      if(this.valor === 'z'){
        this.router.navigate(['calendario'], { queryParams: { valor: 'x', torneo: item.id  } });
      }
      else if(this.valor === 'r'){
        this.router.navigate(['reportes'], { queryParams: { valor: 'r', torneo: item.id  } });
      }
      else{
        this.router.navigate(['inscripcion_delegado'], { queryParams: { torneo: item.id } });
      }
    }else if(this.usuarioEnSesion.roles.nombre === 'ROL_DELEGADO' && this.valor !== 'e' && this.valor !== 'c' && this.valor !== 'r'){
      if(this.valor === 'p'){
        this.router.navigate(['planillas'], { queryParams: { torneo: item.id } });
      }else if(this.valor === 'z'){
        this.router.navigate(['calendario'], { queryParams: { valor: 'x', torneo: item.id  } });
      }
      else{
        this.router.navigate(['inscripcion_jugador'], { queryParams: { torneo: item.id } });
      }
    }else if(this.usuarioEnSesion.roles.nombre === 'ROL_PLANILLERO' && this.valor !== 'e' && this.valor !== 'c' && this.valor !== 'r'){
      if(this.valor === 'z'){
        this.router.navigate(['calendario'], { queryParams: { valor: 'x',torneo: item.id  } });
      }else{
        this.router.navigate(['planillar'], { queryParams: { torneo: item.id } });
      }
    }else{
      if(this.valor === 'e' && this.valor !== 'c'){
        this.router.navigate(['estadistica'], { queryParams: { torneo: item.id } });
      }
      if(this.valor === 'c' && this.valor !== 'e'){
        this.router.navigate(['calendario'], { queryParams: { torneo: item.id } });
      }
      if(this.valor === 'z'){
        this.router.navigate(['calendario'], { queryParams: { valor: 'x',torneo: item.id  } });
      }
    }
  }

  eliminarCampeonato(campeonato: any): void{
    this.confirmationService.confirm({
      message: 'Seguro desea eliminar el campeonato, con toda la información relacionada?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.campeonatoService.delete(campeonato.id, this.tokenUser).subscribe(
          data => {
            this.listaCampeonatosMostrar = [];
            this.cargarCampeonatos();
            this.showSuccessDelete();
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

  showErrorDelete() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo eliminar el Campeonato'});
  }

  showSuccessDelete() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Campeonato eliminado correctamente'});
  }

  onInputChange() {
    this.inputTextNombreTorneo = this.inputTextNombreTorneo.toUpperCase();
  }

  showErrorTokenExpired() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'Token Expirado debe iniciar sesión'});
  }

}