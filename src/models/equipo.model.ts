import { ICampeonato } from "./campeonato.model";
import { IGrupo } from "./grupo.model";
import { IUsuario } from "./usuario.model";

export interface IEquipo {
    id?: number;
    nombre?: string;
    idCampeonato?: ICampeonato;
    delegado?: IUsuario;
    idGrupo?: IGrupo;
    puntos?: number;
    estado?: string;
  }
  
export class Equipo implements IEquipo {
    constructor(
        public id?: number,
        public nombre?: string,
        public idCampeonato?: ICampeonato,
        public delegado?: IUsuario,
        public idGrupo?: IGrupo,
        public puntos?: number,
        public estado?: string
    ) {}
}