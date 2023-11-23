import { IEquipo } from "./equipo.model";
import { Moment } from 'moment';

export interface IPartido {
    id?: number;
    equipoA?: IEquipo;
    equipoB?: IEquipo;
    fecha?: Moment;
    hora?: string;
    cancha?: number;
    nivel?: string;
  }
  
export class Partido implements IPartido {
    constructor(
        public id?: number,
        public usuario?: string,
        public identificacion?: string,
        public contrasena?: string,
        public idRol?: number,
        public celular?: number
    ) {}
}