import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Campeonato } from "src/models/campeonato.model";
import { Grupo, IGrupo } from "src/models/grupo.model";
import { CampeonatoService } from "src/services/campeonato.service";
import { EquipoService } from "src/services/equipo.service";
import { EquipoDeportistaService } from "src/services/equipoDeportista.service";
import { GrupoService } from "src/services/grupo.service";
import { commonMessages } from "src/shared/constants/commonMessages";
import { IlistarDeportistas, IlistarEquipos, IlistarGrupos } from "src/shared/vo/opcion-vo";

@Component({
    selector: 'estadistica',
    templateUrl: './estadistica.component.html',
    styleUrls: ['./estadistica.component.scss']
})
export class EstadisticaComponent implements OnInit {
    idTorneo = 0;
    listaDeportistasAnotaciones: Array<IlistarDeportistas> = [];
    listaDeportistasValla: Array<IlistarDeportistas> = [];
    listaPosicionEquipos: Array<IlistarEquipos> = [];
    listaGruposMostrar: Array<IlistarGrupos> = [];
    listaGrupos: Array<IGrupo> = [];
    grupoValue!: any;
    torneoValue!: Campeonato;
    nombreAnotador!: string;
    buscarAnotador!: string;
    deporteTorneo = 0;
    labels = commonMessages;

    constructor(
        private equipoDeportistaService: EquipoDeportistaService,
        private route: ActivatedRoute,
        private campeonatoService: CampeonatoService,
        private equipoService: EquipoService,
        private grupoService: GrupoService
      ) {
    }

    ngOnInit(): void {
        const param = this.route.snapshot.queryParamMap.get('torneo')!;
        this.idTorneo = parseInt(param, 10);
        this.cargarTorneo(this.idTorneo);
        this.cargarGrupo(this.idTorneo);
    }

    cargarGrupo(torneo : any): void{
        this.grupoService.getGrupoByTorneo(torneo).subscribe(grupo => {
            this.listaGrupos = grupo;
            this.listaGrupos.forEach(element => {
                this.listaGruposMostrar.push({
                    id: element.id,
                    codigo: element.codigo
                });
            });
        });
    }

    cargarAnotaciones(): void{
        this.equipoDeportistaService.getDeportistaAnotaciones(this.idTorneo).subscribe(data => {
            if(this.torneoValue.deporte === 2){
                data.forEach(element => {
                    this.listaDeportistasAnotaciones.push({
                        nombre: element.idDeportista.nombre,
                        apellido: element.idDeportista.apellido,
                        equipo: element.idEquipo.nombre,
                        anotaciones: element.idDeportista.cestas.toString()
                    });
                });
            }else{
                data.forEach(element => {
                    this.listaDeportistasAnotaciones.push({
                        nombre: element.idDeportista.nombre,
                        apellido: element.idDeportista.apellido,
                        equipo: element.idEquipo.nombre,
                        anotaciones: element.idDeportista.anotaciones.toString()
                    });
                });
            }
        });
        this.equipoDeportistaService.getVallaMenosVencida(this.idTorneo).subscribe(data => {
            data.forEach(element => {
                this.listaDeportistasValla.push({
                    nombre: element.idDeportista.nombre,
                    apellido: element.idDeportista.apellido,
                    equipo: element.idEquipo.nombre,
                    golesRecibidos: element.idDeportista.golesRecibidos.toString()
                });
            });
        });
    }

    cargarTorneo(torneo:any): void{
        this.campeonatoService.getCampeonato(torneo).subscribe(data => {
            this.torneoValue = data;
            this.deporteTorneo = this.torneoValue.deporte;
            if(this.torneoValue.deporte == 1 || this.torneoValue.deporte == 3){
                this.nombreAnotador = "Goleadores";
                this.buscarAnotador = "Buscar Goleador";
            }
            else if(this.torneoValue.deporte == 2){
                this.nombreAnotador = "Encestadores";
                this.buscarAnotador = "Buscar Encestador";
            }
            this.cargarAnotaciones();
        });
    }

    cargarEquipos(torneo:any, grupo:any): void {
        this.listaPosicionEquipos = [];
        this.equipoService.getPosicionEquipos(torneo, grupo).subscribe(data => {
            let pos = 0;
            data.forEach(element => {
                pos = pos + 1;
                this.listaPosicionEquipos.push({
                    posicion: pos.toString(),
                    nombre: element.nombre,
                    puntos: element.puntos
                });
            });
        });
    }
    cambiarGrupos(evento: any): void{
        this.cargarEquipos(this.idTorneo, this.grupoValue.id);
    }

}