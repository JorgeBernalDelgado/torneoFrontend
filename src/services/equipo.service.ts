import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BackendURL } from 'src/shared/constants/app.constants';
import { createRequestOption } from 'src/shared/util/request-util';
import { IEquipo } from 'src/models/equipo.model';


type EntityResponseType = HttpResponse<IEquipo>;
type EntityArrayResponseType = HttpResponse<IEquipo[]>;

@Injectable({ providedIn: 'root' })
export class EquipoService {
  public resourceUrl = BackendURL + 'api/equipos';

  constructor(private http: HttpClient) {}

  public create(equipo: IEquipo, token?: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    return this.http.post(this.resourceUrl, equipo, {headers});
  }

  public update(usuario: IEquipo, token?: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    return this.http.put(this.resourceUrl, usuario, {headers});
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

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEquipo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEquipo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getEquipos(): Observable<any> {
    const url = this.resourceUrl + '/listar';
    return this.http.get<any>(url);
  }

  getEquipo(equipo: any, token?: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    const url = this.resourceUrl + '/listarEquipo?equipo=' + equipo;
    return this.http.get<any>(url, {headers});
  }

  getEquipoByTorneo(torneo: any, token?:string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    const url = this.resourceUrl + '/listarEquipoByTorneo?torneo=' + torneo;
    return this.http.get<any>(url, {headers});
  }

  getEquipoByName(nombre: any, token:string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    const url = this.resourceUrl + '/listarEquipoByName?nombre=' + nombre;
    return this.http.get<any>(url, {headers});
  }

  getEquipoByDelegado(delegado: any, torneo: any, token?:string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    const url = this.resourceUrl + '/listarEquipoByDelegado?delegado=' + delegado + '&torneo=' + torneo;
    return this.http.get<any>(url, {headers});
  }

  getPosicionEquipos(torneo: any, grupo: any): Observable<any> {
    const url = this.resourceUrl + '/listarPosicionEquipos?torneo=' + torneo+"&grupo="+ grupo;
    return this.http.get<any>(url);
  }

}