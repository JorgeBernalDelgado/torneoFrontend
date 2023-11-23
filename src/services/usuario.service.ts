import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IUsuario } from 'src/models/usuario.model';
import { BackendURL } from 'src/shared/constants/app.constants';
import { createRequestOption } from 'src/shared/util/request-util';


type EntityResponseType = HttpResponse<IUsuario>;
type EntityArrayResponseType = HttpResponse<IUsuario[]>;

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjE0NjYyODcsImlhdCI6MTY2MTQ2MjY4NywiaXNzIjoiXCJ3d3cudG9ybmVvLmNvbVwiIiwic3ViIjoie1wiaWRcIjo5LFwidXN1YXJpb1wiOlwicm9iaW5cIixcImlkZW50aWZpY2FjaW9uXCI6XCIxMjM0NVwiLFwiY29udHJhc2VuYVwiOlwibTB4dTFWbnpndGVma3VSWk1CVmRmQVxcdTAwM2RcXHUwMDNkXCIsXCJjZWx1bGFyXCI6NjU0Nzg5LFwibm9tYnJlXCI6XCJyb2JpblwiLFwiYXBlbGxpZG9cIjpcImNydXpcIixcInJvbGVzXCI6W3tcImlkXCI6MSxcIm5vbWJyZVwiOlwiUk9MX0FETUlOXCJ9XX0ifQ.MfvZ_Z9qyE8knNu9CQMQMEwkRAshoAcZnNJ9f6iqXLo',
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
})
};

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  
  // headers = new Headers();
  public resourceUrl = BackendURL + 'api/usuarios';
  public resourceUrlDeleteAdmin = BackendURL + 'api/usuarios/deleteAdmin';

  constructor(private http: HttpClient) {}

  public create(usuario: IUsuario, token?: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    return this.http.post(this.resourceUrl, usuario, {headers});
  }

  public createAdmin(usuario: IUsuario): Observable<any> {
    return this.http.post(this.resourceUrl+"/crearAdmin", usuario);
  }

  public update(usuario: IUsuario, token?:string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    return this.http.put(this.resourceUrl, usuario,{headers});
  }

  public delete(id: number, token?: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    return this.http.delete(`${this.resourceUrl}/${id}`,{headers});
  }

  public deleteAdmin(id: number, token?: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    return this.http.delete(`${this.resourceUrlDeleteAdmin}/${id}`,{headers});
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUsuario>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUsuario[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getDelegado(delegado: any, torneo?: any): Observable<any> {
    const url = this.resourceUrl + '/listarDelegados?delegado=' + delegado + '&torneo='+ torneo;
    return this.http.get<any>(url);
  }

  getAdmin(admin: any): Observable<any> {
    const url = this.resourceUrl + '/listarUsuariosAdmin?admin=' + admin;
    return this.http.get<any>(url);
  }

  getUsuario(usuario: any, token? : string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    const url = this.resourceUrl + '/listarUsuario?usuario=' + usuario;
    return this.http.get<any>(url, {headers});
  }
}