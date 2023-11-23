import { ICampeonato } from "./campeonato.model";

export interface ICalendario {
    id?: number;
    hora?: Date;
    equipoA?: string;
    equipoB?: string;
    categoria?: string;
    fecha?: Date;
    idCampeonato?: ICampeonato;
    jornada?: number;
    fase?: string;
}

export class Calendario implements ICalendario {
    constructor(
        public id?: number,
        public hora?: Date,
        public equipoA?: string,
        public equipoB?: string,
        public categoria?: string,
        public fecha?: Date,
        public idCampeonato?: ICampeonato,
        public jornada?: number,
        public fase?: string
    ) {}
}