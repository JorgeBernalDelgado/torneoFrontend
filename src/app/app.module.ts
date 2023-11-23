import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InscripcionDelegadoComponent } from './inscripcion_delegado/inscripcion_delegado.component';
import { TorneosComponent } from './torneos/torneos.component';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { DataViewModule } from 'primeng/dataview'
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {RatingModule} from 'primeng/rating';
import {RippleModule} from 'primeng/ripple';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import { InscripcionJugadorComponent } from './inscripcion_jugador/inscripcion_jugador.component';
import { FileUploadModule } from 'primeng/fileupload';
import {RadioButtonModule} from 'primeng/radiobutton';
import { PlanillarComponent } from './planillar/planillar.component';
import {PickListModule} from 'primeng/picklist';
import {CalendarModule} from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import {CardModule} from 'primeng/card';
import { PlanillasComponent } from './planillas/planillas.component';
import { EstadisticaComponent } from './estadistica/estadistica.component';
import { PlanilleroComponent } from './planillero/planillero.component';
import { LoginComponent } from './login/login.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { UsuarioAdminComponent } from './usuario_admin/usuario_admin.component';
import { DragDropModule } from 'primeng/dragdrop';
import { KnobModule } from 'primeng/knob';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReportesComponent } from './reporte/reportes.component';
import { DatosComponent } from './datos/datos.component';

@NgModule({
  declarations: [
    AppComponent,
    InscripcionDelegadoComponent,
    InscripcionJugadorComponent,
    TorneosComponent,
    PlanillarComponent,
    PlanillasComponent,
    EstadisticaComponent,
    PlanilleroComponent,
    LoginComponent,
    CalendarioComponent,
    UsuarioAdminComponent,
    ReportesComponent,
    DatosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DataViewModule,
    DialogModule,
    ButtonModule,
    BrowserAnimationsModule,
    ToastModule,
    RippleModule,
    PanelModule,
    DropdownModule,
    InputTextModule,
    RatingModule,
    TabViewModule,
    ConfirmDialogModule,
    TableModule,
    TooltipModule,
    FileUploadModule,
    RadioButtonModule,
    PickListModule,
    CalendarModule,
    CheckboxModule,
    CardModule,
    DragDropModule,
    KnobModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
