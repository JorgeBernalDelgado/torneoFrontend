import { IGrupo } from "src/models/grupo.model";

export interface IOpcionVo {
    codigo: string | number | undefined;
    nombre: string;
}

export interface IlistarCampeonatos {
    id?: string | undefined;
    nombre_campeonato?: string | undefined;
    estado?: string | undefined;
    deporte?: string | undefined;
    categoria?: string | undefined;
    rama?: string | undefined;
    localidad?: string | undefined;
    rango_annio?: string | undefined;
    planilla?: string | undefined;
    division?: string | undefined;
    carnet?: string | undefined;
}

export interface IlistarUsuarios {
    id?: string | undefined;
    usuario?: string | undefined;
    identificacion?: string | undefined;
    rol?: string | undefined;
    celular?: string | undefined;
    nombre?: string | undefined;
    apellido?: string | undefined;
    contrasena?: string | undefined;
}

export interface IlistarDelegados {
    id?: string | undefined;
    usuario?: string | undefined;
    identificacion?: string | undefined;
    rol?: string | undefined;
    celular?: string | undefined;
    nombre?: string | undefined;
    apellido?: string | undefined;
    contrasena?: string | undefined;
}

export interface IlistarPlanilleros {
    id?: string | undefined;
    usuario?: string | undefined;
    identificacion?: string | undefined;
    rol?: string | undefined;
    celular?: string | undefined;
    nombre?: string | undefined;
    apellido?: string | undefined;
    contrasena?: string | undefined;
}

export interface IlistarEquipos {
    id?: string | undefined;
    nombre?: string | undefined;
    campeonato?: string | undefined;
    delegado?: string | undefined;
    grupo?: string | undefined;
    puntos?: string | undefined;
    estado?: string | undefined;
    idCampeonato?: number | undefined;
    idDelegado?: number | undefined;
    posicion?: string | undefined;
    idGrupo?: number | undefined;
}

export interface IlistarDeportistas {
    id?: string | undefined;
    tipoIdentificacion?: string | undefined;
    identificacion?: string | undefined;
    nombre?: string | undefined;
    apellido?: string | undefined;
    fechaNacimiento?: string | Date | undefined;
    fotoDeportista?: string | undefined;
    numeroCamiseta?: string | undefined;
    equipo?: string | undefined;
    posicion?: string | undefined;
    golesRecibidos?: string | undefined;
    anotaciones?: string | undefined;
    documento?: string | undefined;
}

export interface IlistarEquipoDeportistas {
    id?: string | undefined;
    identificacion?: string | undefined;
    nombre?: string | undefined;
    apellido?: string | undefined;
    foto?: string | undefined;
    htmlDataCarnet?: string | undefined;
    no?: string | undefined;
    equipo?: string | undefined;
}

export interface IlistarCalendarios{
    id?: number | undefined;
    hora?: string | undefined;
    equipoa?: string | undefined;
    equipob?: string | undefined;
    categoria?: string | undefined;
    fecha?: string | undefined;
    fase?: string | undefined;
    jornada?: number | undefined;
}

export interface IlistarGrupos{
    id?: number | undefined;
    codigo?: string | undefined;
}

export interface IlistarDetallePartido{
    id?: string | undefined;
    anotacionesa?: string | undefined;
    anotacionesb?: string | undefined;
    arbitro?: string | undefined;
    categoria?: string | undefined;
    equipoGanador?: string | Date | undefined;
    fecha?: string | undefined;
    hora?: string | undefined;
    informeArbitral?: string | undefined;
    juez1?: string | undefined;
    juez2?: string | undefined;
    campeonato?: string | undefined;
    equipoa?: string | undefined;
    equipob?: string | undefined;
    fase?: string | undefined;
    jornada?: string | undefined;
}