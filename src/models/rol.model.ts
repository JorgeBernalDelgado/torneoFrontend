

export interface IRol {
    id?: number;
    nombre?: string;
}
  
export class Rol implements IRol {
    constructor(
        public id?: number,
        public nombre?: string
    ) {}
}