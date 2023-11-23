import { Equipo } from "./equipo.model";
import { Moment } from 'moment';
import { Campeonato } from "./campeonato.model";

export interface IDetallePartido {
    id?: number;
    equipoa?: Equipo;
    equipob?: Equipo;
    fecha?: Moment;
    hora?: string;
    anotacionesa?: number;
    anotacionesb?: number;
    arbitro?: string;
    juez1?: string;
    juez2?: string;
    categoria?: string;
    equipoGanador?: string;
    informeArbitral?: string;
    campeonato?: Campeonato;
    fase?: string;
    jornada?: number;
}

export class DetallePartido implements IDetallePartido {
    constructor(
        public id?: number,
        public equipoa?: Equipo,
        public equipob?: Equipo,
        public fecha?: Moment,
        public hora?: string,
        public anotacionesa?: number,
        public anotacionesb?: number,
        public arbitro?: string,
        public juez1?: string,
        public juez2?: string,
        public categoria?: string,
        public equipoGanador?: string,
        public informeArbitral?: string,
        public campeonato?: Campeonato,
        public fase?: string,
        public jornada?: number
    ) {}
}