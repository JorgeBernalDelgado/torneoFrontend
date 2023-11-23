import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IDeportista } from "src/models/deportista.model";
import { IEquipo } from "src/models/equipo.model";
import { IEquipoDeportista } from "src/models/equipodeportista.model";
import { BackendURL } from "src/shared/constants/app.constants";

@Injectable({ providedIn: 'root' })
export class DeportistaService {
    public resourceUrl = BackendURL + 'api/deportistas';

    constructor(private http: HttpClient) {}

    public create(deportista: IEquipoDeportista, token?: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
          });
        return this.http.post(this.resourceUrl, deportista, {headers});
    }

    public update(deportista: IDeportista, token?: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
          });
        return this.http.put(this.resourceUrl, deportista, {headers});
    }

    public delete(id: number, token?: string): Observable<any> {
      let headers = new HttpHeaders({
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`,
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
      });
        return this.http.delete(`${this.resourceUrl}/${id}`, {headers});
    }

    getDeportista(deportista: any, token?: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
          });
        const url = this.resourceUrl + '/listarDeportista?deportista=' + deportista;
        return this.http.get<any>(url, {headers});
    }

    getDeportistas(token?:string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
          });
        const url = this.resourceUrl + '/listar';
        return this.http.get<any>(url, {headers});
    }

}