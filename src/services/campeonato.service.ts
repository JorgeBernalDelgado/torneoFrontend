import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BackendURL } from 'src/shared/constants/app.constants';
import { createRequestOption } from 'src/shared/util/request-util';
import { ICampeonato } from 'src/models/campeonato.model';


type EntityResponseType = HttpResponse<ICampeonato>;
type EntityArrayResponseType = HttpResponse<ICampeonato[]>;

@Injectable({ providedIn: 'root' })
export class CampeonatoService {
  public resourceUrl = BackendURL + 'api/campeonatos';

  constructor(private http: HttpClient) {}

  public create(campeonato: ICampeonato, token?: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    return this.http.post(this.resourceUrl, campeonato, {headers});
  }

  update(campeonato: ICampeonato): Observable<EntityResponseType> {
    return this.http.put<ICampeonato>(this.resourceUrl, campeonato, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICampeonato>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICampeonato[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  public delete(id: number, token?: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT, DELETE"
    });
      return this.http.delete(`${this.resourceUrl}/${id}`, {headers});
  }

  getCampeonatos(): Observable<any> {
    const url = this.resourceUrl + '/listar';
    return this.http.get<any>(url);
  }

  getCampeonato(campeonato: any): Observable<any> {
    const url = this.resourceUrl + '/listarCampeonato?campeonato=' + campeonato;
    return this.http.get<any>(url);
  }
}