import { ICampeonato } from "./campeonato.model";
import { IDeportista } from "./deportista.model";
import { IEquipo } from "./equipo.model";

export interface IEquipoDeportista {
    id?: number;
    idEquipo?: IEquipo;
    idDeportista?: IDeportista;
    idCampeonato?: ICampeonato;
}

export class EquipoDeportista implements IEquipoDeportista {
    constructor(
        public id?: number,
        public idEquipo?: IEquipo,
        public idDeportista?: IDeportista,
        public idCampeonato?: ICampeonato
    ) {}
}