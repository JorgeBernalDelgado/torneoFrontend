import { Moment } from 'moment';

export interface IDeportista {
    id?: number;
    identificacion?: string;
    tipoIdentificacion?: number;
    nombre?: string;
    apellido?: string;
    fechaNacimiento?: Moment;
    fotoDeportista?: string;
    numeroCamiseta?: number;
    posicion?: string;
    golesRecibidos?: number;
    anotaciones?: number;
    documento?: string;
    cestas?: number;
  }
  
export class Deportista implements IDeportista {
    constructor(
        public id?: number,
        public identificacion?: string,
        public tipoIdentificacion?: number,
        public nombre?: string,
        public apellido?: string,
        public fechaNacimiento?: Moment,
        public fotoDeportista?: string,
        public numeroCamiseta?: number,
        public posicion?: string,
        public golesRecibidos?: number,
        public anotaciones?: number,
        public documento?: string,
        public cestas?: number
    ) {}
}