import { ICampeonato } from "./campeonato.model";

export interface IGrupo {
    id?: number;
    codigo?: string;
    idCampeonato?: ICampeonato;
  }
  
export class Grupo implements IGrupo {
    constructor(
        public id?: number,
        public codigo?: string,
        public idCampeonato?: ICampeonato
    ) {}
}