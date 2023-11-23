import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ICampeonato } from 'src/models/campeonato.model';
import { IUsuario, Usuario } from 'src/models/usuario.model';
import { UsuarioService } from 'src/services/usuario.service';
import { commonMessages } from 'src/shared/constants/commonMessages';
import { IlistarCampeonatos, IlistarDelegados, IlistarEquipos, IlistarGrupos, IOpcionVo } from 'src/shared/vo/opcion-vo';
import { CampeonatoService } from 'src/services/campeonato.service';
import { EquipoService } from 'src/services/equipo.service';
import { Equipo, IEquipo } from 'src/models/equipo.model';
import { GrupoService } from 'src/services/grupo.service';
import { Rol } from 'src/models/rol.model';
import { TokenStorageService } from 'src/services/tokenStorage.service';
import { IGrupo } from 'src/models/grupo.model';

@Component({
  selector: 'inscripcion_delegado',
  templateUrl: './inscripcion_delegado.component.html',
  styleUrls: ['./inscripcion_delegado.component.scss']
})
export class InscripcionDelegadoComponent implements OnInit{
  formDatosDelegado!: FormGroup;
  formDatosDelegadoEditar!: FormGroup;
  formDatosEquipo!: FormGroup;
  formDatosEquipoEditar!: FormGroup;
  formDatosContrasenaEditar!: FormGroup;
  labels = commonMessages;
  identificacionesValue: IOpcionVo[] = commonMessages.ARRAY_IDENTIFICACIONES;
  iconoOjoUno = "pi pi-eye";
  iconoOjoDos = "pi pi-eye";
  tipoContrasenaUno = "password";
  tipoContrasenaDos = "password";
  validacionIncorrecta = false;
  delegado!: Usuario;
  equipo!: Equipo;
  ConfirmarClave: any;
  listaGrupos: Array<IGrupo> = [];
  listaUsuarios: Array<IUsuario> = [];
  listaDelegadosMostrar: Array<IlistarDelegados> = [];
  listaGruposMostrar: Array<IlistarGrupos> = [];
  listaEquipos: Array<IEquipo> = [];
  listaEquiposMostrar: Array<IlistarEquipos> = [];
  roles: IOpcionVo[] = commonMessages.ARRAY_ROLES;
  displayModalDelegado: boolean;
  displayModalEquipo: boolean;
  displayModalContrasena: boolean;
  userDelegado: any;
  userEquipo: any;
  idTorneo = 0;
  listaCampeonatos: Array<ICampeonato> = [];
  listaCampeonatosMostrar: Array<IlistarCampeonatos> = [];
  tokenUser = "";
  inputTextNombreEquipo: string = '';
  contrasenaDelgadoEditar = "";

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private campeonatoService: CampeonatoService,
    private equipoService: EquipoService,
    private grupoService: GrupoService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()){
      this.tokenUser = this.tokenStorage.getToken();
    }
    const param = this.route.snapshot.queryParamMap.get('torneo')!;
    this.idTorneo = parseInt(param, 10);
    this.cargarCampeonatos();
    this.cargarDelegados();
    this.crearFormularioDelegado();
    this.crearFormularioDelegadoEditar();
    this.crearFormularioEquipo();
    this.crearFormularioEquipoEditar();
    this.crearFormularioContrasenaEditar();
    this.cargarGrupos();

    this.formDatosEquipo.get('nombreEquipo').valueChanges.subscribe((value: string) => {
      this.formDatosEquipo.patchValue({
        nombreEquipo: value.toUpperCase()
      }, { emitEvent: false }); // Usa emitEvent: false para evitar bucles infinitos
    });
  }

  showModalDialog(delegado:any) {
    this.userDelegado = delegado;
    this.cargarFormularioDelegado();
    this.displayModalDelegado = true;
  }

  showModalDialogEquipo(equipo:any) {
    this.userEquipo = equipo;
    this.cargarFormularioEquipo();
    this.displayModalEquipo = true;
  }

  showModalDialogContrasena(delegado:any) {
    this.userDelegado = delegado;
    this.displayModalContrasena = true;
  }

  hideModalDialog() {
    this.displayModalDelegado = false;
  }

  hideModalDialogEquipo() {
    this.displayModalEquipo = false;
  }

  hideModalDialogContrasena() {
    this.displayModalContrasena = false;
  }

  crearFormularioDelegado(): void {
    this.formDatosDelegado = this.fb.group({
      id: [''],
      usuario: ['',[Validators.required]],
      identificacion: ['',[Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      contrasena: ['',[Validators.required]],
      contrasenaRepetida: ['',[Validators.required]],
      idRol: [''],
      celular: ['',[Validators.required, this.validateNumberLength]],
      nombreDelegado: ['',[Validators.required]],
      apellidoDelegado: ['',[Validators.required]]
    },{ validator: this.passwordsMatch }
    );
  }

  validateNumberLength(control) {
    const value = control.value;
    if (value === null || value === '') {
      return null; 
    }
    
    const isValid = /^[0-9]{10}$/.test(value);
    return isValid ? null : { invalidNumberLength: true };
  }

  passwordsMatch(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('contrasena')?.value;
    const confirmPassword = control.get('contrasenaRepetida')?.value;
  
    return password === confirmPassword ? null : { 'passwordsMismatch': true };
  }

  crearFormularioDelegadoEditar(): void {
    this.formDatosDelegadoEditar = this.fb.group({
      id: [''],
      usuario: ['',[Validators.required]],
      identificacion: ['',[Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      idRol: [''],
      celular: ['',[Validators.required, this.validateNumberLength]],
      nombreDelegado: ['',[Validators.required]],
      apellidoDelegado: ['',[Validators.required]],
      contrasena: ['']
    });
  }

  crearFormularioEquipo(): void {
    this.formDatosEquipo = this.fb.group({
      id: [''],
      nombreEquipo: ['',[Validators.required]],
      idCampeonato: [''],
      idDelegado: ['',[Validators.required]],
      idGrupo: ['',[Validators.required]]
    });
  }

  crearFormularioEquipoEditar(): void {
    this.formDatosEquipoEditar = this.fb.group({
      id: [''],
      nombreEquipo: ['',[Validators.required]],
      idDelegado: ['',[Validators.required]],
      idCampeonato: ['',[Validators.required]],
      idGrupo: ['',[Validators.required]]
    });
  }

  crearFormularioContrasenaEditar(): void {
    this.formDatosContrasenaEditar = this.fb.group({
      contrasena: ['',[Validators.required]],
      contrasenaRepetida: ['',[Validators.required]]
    },{ validator: this.passwordsMatch });
  }

  cargarFormularioDelegado(): void {
    if(this.userDelegado){
      this.formDatosDelegadoEditar.patchValue({
        id: this.userDelegado.id,
        usuario: this.userDelegado.usuario,
        identificacion: this.userDelegado.identificacion,
        idRol: "Delegado",
        celular: this.userDelegado.celular,
        nombreDelegado: this.userDelegado.nombre,
        apellidoDelegado: this.userDelegado.apellido,
        contrasena: this.userDelegado.contrasena
      });
    }
  }

  cargarFormularioEquipo(): void {
    if(this.userEquipo){
      this.formDatosEquipoEditar.patchValue({
        id: this.userEquipo.id,
        nombreEquipo: this.userEquipo.nombre,
        idCampeonato: this.userEquipo.idCampeonato.toString(),
        idDelegado: this.userEquipo.idDelegado.toString(),
        idGrupo: this.userEquipo.idGrupo
      });
    }
  }


  agregarDelegado(): void{
    let rolValue = new Rol();
    rolValue.nombre = "ROL_DELEGADO";
    rolValue.id = 2;
    this.validacionIncorrecta = false;
    this.delegado = new Usuario();
    this.delegado.nombre = this.formDatosDelegado.controls['nombreDelegado'].value;
    this.delegado.apellido = this.formDatosDelegado.controls['apellidoDelegado'].value;
    this.delegado.usuario = this.formDatosDelegado.controls['usuario'].value;
    this.delegado.identificacion = this.formDatosDelegado.controls['identificacion'].value;
    this.delegado.celular = this.formDatosDelegado.controls['celular'].value;
    this.delegado.contrasena = this.formDatosDelegado.controls['contrasena'].value;
    this.delegado.roles = ["delegado"];
    if (this.validacionIncorrecta === false) {
      this.confirmationService.confirm({
        message: 'Seguro desea agregar el delegado?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.usuarioService.create(this.delegado, this.tokenUser).subscribe(
            data => {
              if (data!== null) {
                this.showSuccess();
                this.limpiarCampos();
                this.cargarDelegados();
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
              this.showError(err.error);
            }
          );
        },
        reject: () => {
        }
      });
    }
  }

  editarDelegado(): void{
    let rolValue = new Rol();
    rolValue.nombre = "ROL_DELEGADO";
    rolValue.id = 2;
    this.validacionIncorrecta = false;
    this.delegado = new Usuario();
    this.delegado.id = this.userDelegado.id;
    this.delegado.nombre = this.formDatosDelegadoEditar.controls['nombreDelegado'].value;
    this.delegado.apellido = this.formDatosDelegadoEditar.controls['apellidoDelegado'].value;
    this.delegado.usuario = this.formDatosDelegadoEditar.controls['usuario'].value;
    this.delegado.identificacion = this.formDatosDelegadoEditar.controls['identificacion'].value;
    this.delegado.celular = this.formDatosDelegadoEditar.controls['celular'].value;
    this.delegado.contrasena = this.formDatosDelegadoEditar.controls['contrasena'].value;
    this.delegado.roles = [rolValue];
    if (this.validacionIncorrecta === false) {
      this.confirmationService.confirm({
        message: 'Seguro desea editar el delegado?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.usuarioService.update(this.delegado, this.tokenUser).subscribe(
            data => {
              if (data!== null) {
                this.listaDelegadosMostrar = [];
                this.cargarDelegados();
                this.crearFormularioDelegadoEditar();
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

  showSuccess() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Delegado agregado correctamente'});
  }

  showSuccessEdit() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Delegado editado correctamente'});
  }

  showSuccessEditContrasena() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Contraseña actualizada correctamente'});
  }

  showSuccessDelete() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Delegado eliminado correctamente'});
  }

  showSuccessDeleteEquipo() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Equipo eliminado correctamente'});
  }

  showSuccessEquipo() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Equipo agregado correctamente'});
  }

  showSuccessEditEquipo() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Equipo editado correctamente'});
  }

  showError(mensaje: any) {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: mensaje});
  }

  showErrorEdit() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo editar el delegado'});
  }

  showErrorEditContrasena() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo actualizar la contraseña'});
  }

  showErrorDelete() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo eliminar el delegado'});
  }

  showErrorDeleteEquipo() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo eliminar el equipo'});
  }

  showErrorEquipo() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo agregar el equipo'});
  }

  showErrorEditEquipo() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo editar el equipo'});
  }

  showErrorTokenExpired() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'Token Expirado debe iniciar sesión'});
  }

  primeraContrasena(): void{
    if(this.iconoOjoUno === "pi pi-eye"){
      this.iconoOjoUno = "pi pi-eye-slash";
      this.tipoContrasenaUno = "text";
    }else{
      this.iconoOjoUno = "pi pi-eye";
      this.tipoContrasenaUno = "password";
    }
  }

  segundaContrasena(): void{
    if(this.iconoOjoDos === "pi pi-eye"){
      this.iconoOjoDos = "pi pi-eye-slash";
      this.tipoContrasenaDos = "text";
    }else{
      this.iconoOjoDos = "pi pi-eye";
      this.tipoContrasenaDos = "password";
    }
  }

  limpiarCampos():void{
    this.formDatosDelegado.reset();
  }

  limpiarCamposEditar():void{
    this.formDatosDelegado.reset();
  }

  limpiarCamposEquipo():void{
    this.formDatosEquipo.reset();
  }

  limpiarCamposContrasena():void{
    this.formDatosContrasenaEditar.reset();
  }

  cargarDelegados():void{
    this.listaDelegadosMostrar = [];
    this.usuarioService.getDelegado(2, this.idTorneo).subscribe( delegados => {
      this.listaUsuarios = delegados;
      this.listaUsuarios.forEach(element => {
        this.listaDelegadosMostrar.push({
          id: element.id.toString(),
          usuario: element.usuario,
          identificacion: element.identificacion,
          rol: "Delegado",
          celular: element.celular.toString(),
          nombre: element.nombre,
          apellido: element.apellido,
          contrasena: element.contrasena
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

  cargarGrupos(): void{
    this.grupoService.getGrupoByTorneo(this.idTorneo).subscribe( data => {
      this.listaGrupos = data;
      this.listaGrupos.forEach(element => { 
        this.listaGruposMostrar.push({
          id: element.id,
          codigo: element.codigo
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

  eliminarDelegado(delegado: any): void{
    this.confirmationService.confirm({
      message: 'Seguro desea eliminar el delegado, con toda la información relacionada?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.usuarioService.delete(delegado.id, this.tokenUser).subscribe(
          data => {
            this.cargarDelegados();
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

  cargarCampeonatos(): void{
    this.campeonatoService.getCampeonatos().subscribe(campeonatos =>{
      this.listaCampeonatos = campeonatos;
      this.cargarEquipos();
      this.listaCampeonatos.forEach(element => {
        this.listaCampeonatosMostrar.push({
          id: element.id.toString(),
          nombre_campeonato: element.nombreCampeonato
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

  cargarEquipos(): void{
    this.listaEquiposMostrar = [];
    this.equipoService.getEquipoByTorneo(this.idTorneo, this.tokenUser).subscribe(equipos =>{
      this.listaEquipos = equipos;
      this.listaEquipos.forEach(element => {
        this.listaEquiposMostrar.push({
          id: element.id.toString(),
          nombre: element.nombre,
          campeonato: element.idCampeonato.nombreCampeonato,
          delegado: element.delegado.nombre + " " + element.delegado.apellido,
          idCampeonato: element.idCampeonato.id,
          idDelegado: element.delegado.id,
          puntos: element.puntos.toString(),
          estado: element.estado,
          idGrupo: element.idGrupo.id,
          grupo: element.idGrupo.codigo
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

  agregarEquipo(): void {
    this.validacionIncorrecta = false;
    this.equipo = new Equipo();
    this.equipo.nombre = this.formDatosEquipo.controls['nombreEquipo'].value;
    this.equipo.puntos = 0;
    const delegado = this.formDatosEquipo.controls['idDelegado'].value;
    const grupo = this.formDatosEquipo.controls['idGrupo'].value;
    if (this.validacionIncorrecta === false) {
      this.usuarioService.getUsuario(delegado, this.tokenUser).subscribe(usuario => {
        this.equipo.delegado = usuario;
        this.campeonatoService.getCampeonato(this.idTorneo).subscribe(campeonato => {
          this.equipo.idCampeonato = campeonato;
          this.equipo.estado = "A";
          this.equipo.puntos = 0;
          this.grupoService.getgrupo(grupo).subscribe(grupo => {
            this.equipo.idGrupo = grupo;
            this.confirmationService.confirm({
              message: 'Seguro desea agregar el equipo?',
              header: 'Confirmar',
              icon: 'pi pi-exclamation-triangle',
              acceptLabel: 'Si',
              rejectLabel: 'No',
              accept: () => {
                this.equipoService.create(this.equipo, this.tokenUser).subscribe(
                  data => {
                    if (data!== null) {
                      this.inputTextNombreEquipo = "";
                      this.showSuccessEquipo();
                      this.cargarEquipos();
                      this.limpiarCamposEquipo();
                    }
                  },
                  err => {
                    this.showError(err.error);
                  }
                );
              },
              reject: () => {
              }
            });
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
  }

  editarEquipo(): void{
    this.validacionIncorrecta = false;
    this.equipo = new Equipo();
    this.equipo.id = this.userEquipo.id;
    this.equipo.nombre = this.formDatosEquipoEditar.controls['nombreEquipo'].value;
    this.equipo.puntos = parseInt(this.userEquipo.puntos,10);
    const delegado = this.formDatosEquipoEditar.controls['idDelegado'].value;
    const campeonato = this.formDatosEquipoEditar.controls['idCampeonato'].value;
    const grupo = this.formDatosEquipoEditar.controls['idGrupo'].value;
    this.equipo.estado = this.userEquipo.estado;
    if (this.validacionIncorrecta === false) {
      this.usuarioService.getUsuario(delegado, this.tokenUser).subscribe(usuario => {
        this.equipo.delegado = usuario;
        this.campeonatoService.getCampeonato(campeonato).subscribe(campeonato => {
          this.equipo.idCampeonato = campeonato;
          this.grupoService.getgrupo(grupo).subscribe(grupo => {
            this.equipo.idGrupo = grupo;
            this.confirmationService.confirm({
              message: 'Seguro desea editar el equipo?',
              header: 'Confirmar',
              icon: 'pi pi-exclamation-triangle',
              acceptLabel: 'Si',
              rejectLabel: 'No',
              accept: () => {
                this.equipoService.update(this.equipo, this.tokenUser).subscribe(
                  data => {
                    if (data!== null) {
                      this.inputTextNombreEquipo = "";
                      this.listaEquiposMostrar = [];
                      this.cargarEquipos();
                      this.crearFormularioEquipoEditar();
                      this.hideModalDialogEquipo();
                      this.showSuccessEditEquipo();
                      this.limpiarCamposEquipo();
                    }
                  },
                  err => {
                    this.showErrorEditEquipo();
                  }
                );
              },
              reject: () => {
              }
            });
          });
        }); 
      });
    }
  }

  eliminarEquipo(equipo: any): void{
    this.confirmationService.confirm({
      message: 'Seguro desea eliminar el equipo, con toda la información relacionada?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.equipoService.delete(equipo.id, this.tokenUser).subscribe(
          data => {
            this.cargarEquipos();
            this.showSuccessDeleteEquipo();
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
            this.showErrorDeleteEquipo();
          }
        );
      },
      reject: () => {
      }
    });
  }

  editarContrasena(): void{
    let rolValue = new Rol();
    rolValue.nombre = "ROL_DELEGADO";
    rolValue.id = 2;
    this.validacionIncorrecta = false;
    this.delegado = new Usuario();
    this.delegado = this.userDelegado;
    this.delegado.contrasena = this.formDatosContrasenaEditar.controls['contrasena'].value;
    this.delegado.roles = [rolValue];
    if (this.validacionIncorrecta === false) {
      this.confirmationService.confirm({
        message: 'Seguro desea cambiar la contraseña del delegado?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.usuarioService.update(this.delegado, this.tokenUser).subscribe(
            data => {
              if (data!== null) {
                this.listaDelegadosMostrar = [];
                this.cargarDelegados();
                this.crearFormularioContrasenaEditar();
                this.hideModalDialogContrasena();
                this.showSuccessEditContrasena();
                this.limpiarCamposContrasena();
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
              this.showErrorEditContrasena();
            }
          );
        },
        reject: () => {
        }
      });
    }
  }

  onInputChange() {
    this.inputTextNombreEquipo = this.inputTextNombreEquipo.toUpperCase();
  }

}