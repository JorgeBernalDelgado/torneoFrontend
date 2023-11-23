import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarioComponent } from './calendario/calendario.component';
import { EstadisticaComponent } from './estadistica/estadistica.component';
import { HomeComponent } from './home/home.component';
import { InscripcionDelegadoComponent } from './inscripcion_delegado/inscripcion_delegado.component';
import { InscripcionJugadorComponent } from './inscripcion_jugador/inscripcion_jugador.component';
import { LoginComponent } from './login/login.component';
import { PlanillarComponent } from './planillar/planillar.component';
import { PlanillasComponent } from './planillas/planillas.component';
import { PlanilleroComponent } from './planillero/planillero.component';
import { TorneosComponent } from './torneos/torneos.component';
import { UsuarioAdminComponent } from './usuario_admin/usuario_admin.component';
import { ReportesComponent } from './reporte/reportes.component';
import { DatosComponent } from './datos/datos.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'inscripcion_delegado', component: InscripcionDelegadoComponent},
  {path: 'inscripcion_jugador', component: InscripcionJugadorComponent},
  {path: 'planillar', component: PlanillarComponent},
  {path: 'torneos', component: TorneosComponent},
  {path: 'planillas', component: PlanillasComponent},
  {path: 'estadistica', component: EstadisticaComponent},
  {path: 'planillero', component: PlanilleroComponent},
  {path: 'login', component: LoginComponent},
  {path: 'calendario', component: CalendarioComponent},
  {path: 'e18d818d4c37f49e20481502fb2676a6', component: UsuarioAdminComponent},
  {path: 'reportes', component: ReportesComponent},
  {path: 'datos', component: DatosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
