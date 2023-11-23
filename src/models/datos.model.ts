
export interface IDatos {
    id?: number;
    categoria?: string;
    codigo?: number;
    nombre?: string;
}

export class Datos implements IDatos {
    constructor(
        public id?: number,
        public categoria?: string,
        public codigo?: number,
        public nombre?: string
    ) {}
}
