import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IDetallePartido } from "src/models/detallepartido.model";
import { BackendURL } from "src/shared/constants/app.constants";

@Injectable({ providedIn: 'root' })
export class DetallePartidoService {
    public resourceUrl = BackendURL + 'api/detallePartidos';

    constructor(private http: HttpClient) {}

    public create(detallePartido: IDetallePartido, token:string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
          });
        return this.http.post(this.resourceUrl, detallePartido, {headers});
    }

    public update(detallePartido: IDetallePartido): Observable<any> {
        return this.http.put(this.resourceUrl, detallePartido);
    }

    getCampeonatos(): Observable<any> {
        const url = this.resourceUrl + '/listar';
        return this.http.get<any>(url);
    }

    getDetallePartido(torneo: any, token?: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
          });
        const url = this.resourceUrl + '/listarDetalleByCampeonato?torneo=' + torneo;
        return this.http.get<any>(url, {headers});
    }

}