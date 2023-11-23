
export interface ICampeonato {
    id?: number;
    nombreCampeonato?: string;
    estado?: string;
    deporte?: number;
    categoria?: number;
    rama?: string;
    planilla?: number;
    localidad?: number;
    rangoAnnio?: number;
    division?: number;
    carnet?: string;
  }
  
export class Campeonato implements ICampeonato {
    constructor(
        public id?: number,
        public nombreCampeonato?: string,
        public estado?: string,
        public deporte?: number,
        public categoria?: number,
        public rama?: string,
        public planilla?: number,
        public localidad?: number,
        public rangoAnnio?: number,
        public division?: number,
        public carnet?: string
    ) {}
}