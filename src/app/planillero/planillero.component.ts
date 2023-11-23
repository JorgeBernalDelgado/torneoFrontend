import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { Rol } from "src/models/rol.model";
import { IUsuario, Usuario } from "src/models/usuario.model";
import { TokenStorageService } from "src/services/tokenStorage.service";
import { UsuarioService } from "src/services/usuario.service";
import { commonMessages } from "src/shared/constants/commonMessages";
import { IlistarPlanilleros, IOpcionVo } from "src/shared/vo/opcion-vo";

@Component({
    selector: 'planillero',
    templateUrl: './planillero.component.html',
    styleUrls: ['./planillero.component.scss']
})
export class PlanilleroComponent implements OnInit {
  formDatosPlanillero!: FormGroup;
  formDatosPlanilleroEditar!: FormGroup;
  formDatosContrasenaEditar!: FormGroup;
  validacionIncorrecta = false;
  planillero!: Usuario;
  ConfirmarClave: any;
  labels = commonMessages;
  iconoOjoUno = "pi pi-eye";
  iconoOjoDos = "pi pi-eye";
  tipoContrasenaUno = "password";
  tipoContrasenaDos = "password";
  listaPlanillerosMostrar: Array<IlistarPlanilleros> = [];
  listaUsuarios: Array<IUsuario> = [];
  roles: IOpcionVo[] = commonMessages.ARRAY_ROLES;
  displayModalPlanillero: boolean;
  displayModalContrasena: boolean;
  userPlanillero: any;
  tokenUser = "";

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private usuarioService: UsuarioService,
    private tokenStorage: TokenStorageService,
    private router: Router
    ) {
  }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()){
      this.tokenUser = this.tokenStorage.getToken();
    }
    this.crearFormularioPlanillero();
    this.crearFormularioPlanilleroEditar();
    this.crearFormularioContrasenaEditar();
    this.cargarPlanilleros();
  }

  crearFormularioContrasenaEditar(): void {
    this.formDatosContrasenaEditar = this.fb.group({
      contrasena: ['',[Validators.required]],
      contrasenaRepetida: ['',[Validators.required]]
    },{ validator: this.passwordsMatch });
  }

  passwordsMatch(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('contrasena')?.value;
    const confirmPassword = control.get('contrasenaRepetida')?.value;
  
    return password === confirmPassword ? null : { 'passwordsMismatch': true };
  }

  agregarPlanillero(): void{
    let rolValue = new Rol();
    rolValue.nombre = "ROL_PLANILLERO";
    rolValue.id = 3;
    this.validacionIncorrecta = false;
    this.planillero = new Usuario();
    this.planillero.nombre = this.formDatosPlanillero.controls['nombrePlanillero'].value;
    this.planillero.apellido = this.formDatosPlanillero.controls['apellidoPlanillero'].value;
    this.planillero.usuario = this.formDatosPlanillero.controls['usuario'].value;
    this.planillero.identificacion = this.formDatosPlanillero.controls['identificacion'].value;
    this.planillero.celular = this.formDatosPlanillero.controls['celular'].value;
    this.planillero.contrasena = this.formDatosPlanillero.controls['contrasena'].value;
    this.ConfirmarClave = this.formDatosPlanillero.controls['contrasenaRepetida'].value;
    this.planillero.roles = ["planillero"];
    if (this.validacionIncorrecta === false) {
      this.confirmationService.confirm({
        message: 'Seguro desea agregar el planillero?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.usuarioService.create(this.planillero,this.tokenUser).subscribe(
            data => {
              if (data!== null) {
                this.showSuccess();
                this.cargarPlanilleros();
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
              this.showError(err.error);
            }
          );
        },
        reject: () => {
        }
      });
    }
  }

  editarPlanillero(): void{
    let rolValue = new Rol();
    rolValue.nombre = "ROL_PLANILLERO";
    rolValue.id = 3;
    this.validacionIncorrecta = false;
    this.planillero = new Usuario();
    this.planillero.id = this.userPlanillero.id;
    this.planillero.nombre = this.formDatosPlanilleroEditar.controls['nombrePlanillero'].value;
    this.planillero.apellido = this.formDatosPlanilleroEditar.controls['apellidoPlanillero'].value;
    this.planillero.usuario = this.formDatosPlanilleroEditar.controls['usuario'].value;
    this.planillero.identificacion = this.formDatosPlanilleroEditar.controls['identificacion'].value;
    this.planillero.celular = this.formDatosPlanilleroEditar.controls['celular'].value;
    this.planillero.contrasena = this.formDatosPlanilleroEditar.controls['contrasena'].value;
    this.planillero.roles = [rolValue];
    if (this.validacionIncorrecta === false) {
      this.confirmationService.confirm({
        message: 'Seguro desea editar el planillero?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.usuarioService.update(this.planillero, this.tokenUser).subscribe(
            data => {
              if (data!== null) {
                this.listaPlanillerosMostrar = [];
                this.cargarPlanilleros();
                this.crearFormularioPlanilleroEditar();
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

  crearFormularioPlanillero(): void {
    this.formDatosPlanillero = this.fb.group({
      id: [''],
      usuario: ['',[Validators.required]],
      identificacion: ['',[Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      contrasena: ['',[Validators.required]],
      contrasenaRepetida: ['',[Validators.required]],
      idRol: [''],
      celular: ['',[Validators.required, this.validateNumberLength]],
      nombrePlanillero: ['',[Validators.required]],
      apellidoPlanillero: ['',[Validators.required]]
    }, { validator: this.passwordsMatch });
  }

  crearFormularioPlanilleroEditar(): void {
    this.formDatosPlanilleroEditar = this.fb.group({
      id: [''],
      usuario: ['',[Validators.required]],
      identificacion: ['',[Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      idRol: [''],
      celular: ['',[Validators.required, this.validateNumberLength]],
      nombrePlanillero: ['',[Validators.required]],
      apellidoPlanillero: ['',[Validators.required]],
      contrasena: ['']
    });
  }

  validateNumberLength(control) {
    const value = control.value;
    if (value === null || value === '') {
      return null;
    }
    
    const isValid = /^[0-9]{10}$/.test(value);
    return isValid ? null : { invalidNumberLength: true };
  }

  showSuccess() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Planillero agregado correctamente'});
  }

  showError(mensaje:any) {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: mensaje});
  }

  limpiarCampos():void{
    this.formDatosPlanillero.reset();
  }

  limpiarCamposEditar():void{
    this.formDatosPlanillero.reset();
  }

  showModalDialog(delegado:any) {
    this.userPlanillero = delegado;
    this.cargarFormularioPlanillero();
    this.displayModalPlanillero = true;
  }

  hideModalDialog() {
    this.displayModalPlanillero = false;
  }

  showSuccessEdit() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Planillero editado correctamente'});
  }

  showSuccessEditContrasena() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Contraseña actualizada correctamente'});
  }
  
  showErrorEdit() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo editar el planillero'});
  }

  showSuccessDelete() {
    this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Planillero eliminado correctamente'});
  }

  showErrorDelete() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo eliminar el planillero'});
  }

  showErrorEditContrasena() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo actualizar la contraseña'});
  }

  showErrorTokenExpired() {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'Token Expirado debe iniciar sesión'});
  }

  showModalDialogContrasena(planillero:any) {
    this.userPlanillero = planillero;
    this.displayModalContrasena = true;
  }

  hideModalDialogContrasena() {
    this.displayModalContrasena = false;
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

  cargarPlanilleros():void{
    this.listaPlanillerosMostrar = [];
    this.usuarioService.getDelegado(3,0).subscribe( planilleros => {
      this.listaUsuarios = planilleros;
      this.listaUsuarios.forEach(element => {
        this.listaPlanillerosMostrar.push({
          id: element.id.toString(),
          usuario: element.usuario,
          identificacion: element.identificacion,
          rol: "Planillero",
          celular: element.celular.toString(),
          nombre: element.nombre,
          apellido: element.apellido,
          contrasena: element.contrasena
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

  cargarFormularioPlanillero(): void {
    if(this.userPlanillero){
      this.formDatosPlanilleroEditar.patchValue({
        id: this.userPlanillero.id,
        usuario: this.userPlanillero.usuario,
        identificacion: this.userPlanillero.identificacion,
        idRol: "Planillero",
        celular: this.userPlanillero.celular,
        nombrePlanillero: this.userPlanillero.nombre,
        apellidoPlanillero: this.userPlanillero.apellido,
        contrasena: this.userPlanillero.contrasena
      });
    }
  }

  eliminarPlanillero(planillero: any): void{
    this.confirmationService.confirm({
      message: 'Seguro desea eliminar el planillero?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.usuarioService.delete(planillero.id, this.tokenUser).subscribe(
          data => {
            this.cargarPlanilleros();
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

  editarContrasena(): void{
    let rolValue = new Rol();
    rolValue.nombre = "ROL_PLANILLERO";
    rolValue.id = 3;
    this.validacionIncorrecta = false;
    this.planillero = new Usuario();
    this.planillero = this.userPlanillero;
    this.planillero.contrasena = this.formDatosContrasenaEditar.controls['contrasena'].value;
    this.ConfirmarClave = this.formDatosContrasenaEditar.controls['contrasenaRepetida'].value;
    this.planillero.roles = [rolValue];
    if (this.validacionIncorrecta === false) {
      this.confirmationService.confirm({
        message: 'Seguro desea cambiar la contraseña del planillero?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.usuarioService.update(this.planillero, this.tokenUser).subscribe(
            data => {
              if (data!== null) {
                this.listaPlanillerosMostrar = [];
                this.cargarPlanilleros();
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

  limpiarCamposContrasena():void{
    this.formDatosContrasenaEditar.reset();
  }

}