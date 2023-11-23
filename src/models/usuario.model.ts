import { IRol } from "./rol.model";

export interface IUsuario {
  id?: number;
  usuario?: string;
  identificacion?: string;
  contrasena?: string;
  idRol?: number;
  celular?: number;
  nombre?: string;
  apellido?: string;
  roles?: IRol[] | string[];
  rol?: string[];
}

export class Usuario implements IUsuario {
  constructor(
    public id?: number,
    public usuario?: string,
    public identificacion?: string,
    public contrasena?: string,
    public celular?: number,
    public nombre?: string,
    public apellido?: string,
    public roles?: IRol[] | string[],
    public rol?: string[]
  ) {}
}