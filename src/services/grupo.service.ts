import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BackendURL } from 'src/shared/constants/app.constants';
import { createRequestOption } from 'src/shared/util/request-util';
import { IGrupo } from 'src/models/grupo.model';
import { Campeonato } from 'src/models/campeonato.model';


type EntityResponseType = HttpResponse<IGrupo>;
type EntityArrayResponseType = HttpResponse<IGrupo[]>;

@Injectable({ providedIn: 'root' })
export class GrupoService {
  public resourceUrl = BackendURL + 'api/grupos';
  public resourceUrlCreateGrupos = BackendURL + 'api/grupos/createGrupos';

  constructor(private http: HttpClient) {}

  public create(grupo: IGrupo): Observable<any> {
    return this.http.post(this.resourceUrl, grupo);
  }

  update(grupo: IGrupo): Observable<EntityResponseType> {
    return this.http.put<IGrupo>(this.resourceUrl, grupo, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGrupo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGrupo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getgrupos(): Observable<any> {
    const url = this.resourceUrl + '/listar';
    return this.http.get<any>(url);
  }

  getgrupo(grupo: any): Observable<any> {
    const url = this.resourceUrl + '/listarGrupo?grupo=' + grupo;
    return this.http.get<any>(url);
  }

  public createGrupos(grupoValue: number,campeonatoValue:number,token?: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    let data= {
      "grupo":grupoValue,
      "campeonato":campeonatoValue
    }
    return this.http.post(this.resourceUrlCreateGrupos, data, {headers});    
  }

  getGrupoByTorneo(torneo: any): Observable<any> {
    const url = this.resourceUrl + '/listarGrupoByTorneo?torneo=' + torneo;
    return this.http.get<any>(url);
  }
}