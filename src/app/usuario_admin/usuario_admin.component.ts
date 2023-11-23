import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { Rol } from "src/models/rol.model";
import { IUsuario, Usuario } from "src/models/usuario.model";
import { UsuarioService } from "src/services/usuario.service";
import { commonMessages } from "src/shared/constants/commonMessages";
import { IlistarUsuarios } from "src/shared/vo/opcion-vo";


@Component({
    selector: 'e18d818d4c37f49e20481502fb2676a6',
    templateUrl: './usuario_admin.component.html',
    styleUrls: ['./usuario_admin.component.scss']
})
export class UsuarioAdminComponent implements OnInit{
    formDatosUsuario!: FormGroup;
    validacionIncorrecta = false;
    usuario!: Usuario;
    ConfirmarClave: any;
    labels = commonMessages;
    iconoOjoUno = "pi pi-eye";
    iconoOjoDos = "pi pi-eye";
    tipoContrasenaUno = "password";
    tipoContrasenaDos = "password";
    listaUsuariosMostrar: Array<IlistarUsuarios> = [];
    listaUsuarios: Array<IUsuario> = [];

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private usuarioService: UsuarioService,
        private router: Router
      ) {
    }

    ngOnInit(): void {
        this.cargarUsuarios();
        this.crearFormularioUsuario();
    }

    cargarUsuarios():void{
        this.listaUsuariosMostrar = [];
        this.usuarioService.getAdmin(1).subscribe( usuarios => {
          this.listaUsuarios = usuarios;
          this.listaUsuarios.forEach(element => {
            this.listaUsuariosMostrar.push({
              id: element.id.toString(),
              usuario: element.usuario,
              identificacion: element.identificacion,
              rol: "Admin",
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

    crearFormularioUsuario(): void {
        this.formDatosUsuario = this.fb.group({
          id: [''],
          usuario: ['',[Validators.required]],
          identificacion: ['',[Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
          contrasena: ['',[Validators.required]],
          contrasenaRepetida: ['',[Validators.required]],
          idRol: [''],
          celular: ['',[Validators.required, this.validateNumberLength]],
          nombreUsuario: ['',[Validators.required]],
          apellidoUsuario: ['',[Validators.required]]
        },{ validator: this.passwordsMatch });
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
  
    agregarUsuario(): void{
        let rolValue = new Rol();
        rolValue.nombre = "ROL_ADMIN";
        rolValue.id = 1;
        this.validacionIncorrecta = false;
        this.usuario = new Usuario();
        this.usuario.nombre = this.formDatosUsuario.controls['nombreUsuario'].value;
        this.usuario.apellido = this.formDatosUsuario.controls['apellidoUsuario'].value;
        this.usuario.usuario = this.formDatosUsuario.controls['usuario'].value;
        this.usuario.identificacion = this.formDatosUsuario.controls['identificacion'].value;
        this.usuario.celular = this.formDatosUsuario.controls['celular'].value;
        this.usuario.contrasena = this.formDatosUsuario.controls['contrasena'].value;
        this.ConfirmarClave = this.formDatosUsuario.controls['contrasenaRepetida'].value;
        this.usuario.roles = ["admin"];
          if (this.validacionIncorrecta === false) {
            this.confirmationService.confirm({
              message: 'Seguro desea agregar el usuario?',
              header: 'Confirmar',
              icon: 'pi pi-exclamation-triangle',
              acceptLabel: 'Si',
              rejectLabel: 'No',
              accept: () => {
                this.usuarioService.createAdmin(this.usuario).subscribe(
                  data => {
                    if (data!== null) {
                      this.showSuccess();
                      this.cargarUsuarios();
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

    eliminarUsuario(usuario: any): void{
        this.confirmationService.confirm({
          message: 'Seguro desea eliminar el usuario, con toda la información relacionada?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Si',
          rejectLabel: 'No',
          accept: () => {
            this.usuarioService.deleteAdmin(usuario.id).subscribe(
              data => {
                this.ngOnInit();
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
        this.formDatosUsuario.reset();
    }

    showSuccess() {
        this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Usuario agregado correctamente'});
    }

    showError(mensaje: any) {
        this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: mensaje});
    }

    showSuccessDelete() {
        this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Usuario eliminado correctamente'});
    }

    showErrorDelete() {
        this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo eliminar el Usuario'});
    }

    showErrorTokenExpired() {
      this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'Token Expirado debe iniciar sesión'});
    }

}