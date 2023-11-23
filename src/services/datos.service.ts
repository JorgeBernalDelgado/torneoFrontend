import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IDatos } from "src/models/datos.model";
import { BackendURL } from "src/shared/constants/app.constants";


@Injectable({ providedIn: 'root' })
export class DatosService {
  public resourceUrl = BackendURL + 'api/datos';

  constructor(private http: HttpClient) {}

  public create(datos: IDatos, token?: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    return this.http.post(this.resourceUrl, datos, {headers});
  }

  getDatos(token?:string): Observable<any> {
    let headers = new HttpHeaders({
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`,
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    const url = this.resourceUrl + '/listar';
    return this.http.get<any>(url, {headers});
  }

  delete(id: number, token?: string): Observable<HttpResponse<{}>> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT, DELETE"
    });
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response', headers });
  }

  getDatosByCategoria(categoria: any): Observable<any> {
    const url = this.resourceUrl + '/listarDatosByCategoria?categoria=' + categoria;
    return this.http.get<any>(url);
  }

}