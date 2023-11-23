import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { Datos, IDatos } from "src/models/datos.model";
import { DatosService } from "src/services/datos.service";
import { TokenStorageService } from "src/services/tokenStorage.service";
import { commonMessages } from "src/shared/constants/commonMessages";

@Component({
    selector: 'datos',
    templateUrl: './datos.component.html',
    styleUrls: ['./datos.component.scss']
})
export class DatosComponent implements OnInit {
    formDatos!: FormGroup;
    labels = commonMessages;
    tokenUser = "";
    listaCategorias: Array<IDatos> = [];
    listaLocalidades: Array<IDatos> = [];
    listaRangoAnnios: Array<IDatos> = [];
    listaDivisiones: Array<IDatos> = [];
    datoValue!: Datos;

    constructor(
        private fb: FormBuilder,
        private datosService: DatosService,
        private tokenStorage: TokenStorageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private messageService: MessageService
      ) {
    }

    ngOnInit(): void {
        if(this.tokenStorage.getToken()){
            this.tokenUser = this.tokenStorage.getToken();
        }
        this.cargarInfoFormularios();
        this.cargarDatos();
        this.crearFormularioDatos();
    }
    
    cargarInfoFormularios(): void{
        // categoria
        const btnAdd = document.getElementById('btnAdd');
        const addForm = document.getElementById('addForm');
        const btnCancel = addForm.querySelector('.btn-cancel');

        // Mostrar el formulario al hacer clic en "Agregar Categoría"
        btnAdd.addEventListener('click', function () {
        addForm.style.display = 'block';
        });

        // Ocultar el formulario al hacer clic en "Cancelar"
        btnCancel.addEventListener('click', function () {
        addForm.style.display = 'none';
        });

        // localidad
        const btnAddLocalidad = document.getElementById('btnAddLocalidad');
        const addFormLocalidad = document.getElementById('addFormLocalidad');
        const btnCancelLocalidad = addFormLocalidad.querySelector('.btn-cancel');

        // Mostrar el formulario al hacer clic en "Agregar Categoría"
        btnAddLocalidad.addEventListener('click', function () {
            addFormLocalidad.style.display = 'block';
        });

        // Ocultar el formulario al hacer clic en "Cancelar"
        btnCancelLocalidad.addEventListener('click', function () {
            addFormLocalidad.style.display = 'none';
        });

        // Rango Annios
        const btnAddRangoAnnio = document.getElementById('btnAddRangoAnnio');
        const addFormRangoAnnio = document.getElementById('addFormRangoAnnio');
        const btnCancelRangoAnnio = addFormRangoAnnio.querySelector('.btn-cancel');

        // Mostrar el formulario al hacer clic en "Agregar Categoría"
        btnAddRangoAnnio.addEventListener('click', function () {
            addFormRangoAnnio.style.display = 'block';
        });

        // Ocultar el formulario al hacer clic en "Cancelar"
        btnCancelRangoAnnio.addEventListener('click', function () {
            addFormRangoAnnio.style.display = 'none';
        });

        // Division
        const btnAddDivision = document.getElementById('btnAddDivision');
        const addFormDivision = document.getElementById('addFormDivision');
        const btnCancelDivision = addFormDivision.querySelector('.btn-cancel');

        // Mostrar el formulario al hacer clic en "Agregar Categoría"
        btnAddDivision.addEventListener('click', function () {
            addFormDivision.style.display = 'block';
        });

        // Ocultar el formulario al hacer clic en "Cancelar"
        btnCancelDivision.addEventListener('click', function () {
            addFormDivision.style.display = 'none';
        });
    }

    crearFormularioDatos(): void {
        this.formDatos = this.fb.group({
          id: [''],
          nombre: ['',[Validators.required]],
          codigo: ['',[Validators.required]]
        },{ });
    }

    cargarDatos(): void {
        this.listaCategorias = [];
        this.listaRangoAnnios = [];
        this.listaLocalidades = [];
        this.listaDivisiones = [];
        this.datosService.getDatos(this.tokenUser).subscribe(data => {
            data.forEach(element => {
                if(element.categoria == "categoria"){
                    this.listaCategorias.push({
                        id: element.id.toString(),
                        nombre: element.nombre,
                        codigo: element.codigo
                    });
                }else if(element.categoria == "rango_annio"){
                    this.listaRangoAnnios.push({
                        id: element.id.toString(),
                        nombre: element.nombre,
                        codigo: element.codigo
                    }); 
                }else if(element.categoria == "localidad"){
                    this.listaLocalidades.push({
                        id: element.id.toString(),
                        nombre: element.nombre,
                        codigo: element.codigo
                    });
                }else{
                    this.listaDivisiones.push({
                        id: element.id.toString(),
                        nombre: element.nombre,
                        codigo: element.codigo
                    });
                }
            });
        });
    }

    agregarDato(dato: any): void{
        this.datoValue = new Datos();
        this.datoValue.categoria = dato;
        this.datoValue.nombre = this.formDatos.controls['nombre'].value;
        this.datoValue.codigo = this.formDatos.controls['codigo'].value;
        this.confirmationService.confirm({
            message: 'Seguro desea agregar el dato?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Si',
            rejectLabel: 'No',
            accept: () => {
                this.datosService.create(this.datoValue, this.tokenUser).subscribe(
                data => {
                  if (data!== null) {
                    this.showSuccess();
                    this.cargarDatos();
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

    showSuccess() {
        this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Dato agregado correctamente'});
    }

    limpiarCampos():void{
        this.formDatos.reset();
    }

    showErrorTokenExpired() {
        this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'Token Expirado debe iniciar sesión'});
    }

    showError(mensaje: any) {
        this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: mensaje});
    }

    showSuccessDelete() {
        this.messageService.add({key: 'c',severity:'success', summary: 'Exitoso', detail: 'Registro eliminado correctamente'});
    }

    showErrorDelete() {
        this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: 'No se pudo eliminar el registro'});
    }

    eliminarInfo(info: any): void{
        console.log("info");
        console.log(info);
        
        this.confirmationService.confirm({
          message: 'Seguro desea eliminar el registro?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Si',
          rejectLabel: 'No',
          accept: () => {
            this.datosService.delete(info.id, this.tokenUser).subscribe(
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

    
}