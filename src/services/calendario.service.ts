import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ICalendario } from "src/models/calendario.model";
import { BackendURL } from "src/shared/constants/app.constants";


type EntityResponseType = HttpResponse<ICalendario>;
type EntityArrayResponseType = HttpResponse<ICalendario[]>;

@Injectable({ providedIn: 'root' })
export class CalendarioService {
  public resourceUrl = BackendURL + 'api/calendarios';

  constructor(private http: HttpClient) {}

  public create(calendario: ICalendario, token?: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    return this.http.post(this.resourceUrl, calendario, {headers});
  }

  public update(calendario: ICalendario, token?: string): Observable<any> {
    let headers = new HttpHeaders({
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`,
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
      });
    return this.http.put(this.resourceUrl, calendario, {headers});
}

  getCalendarios(): Observable<any> {
    const url = this.resourceUrl + '/listar';
    return this.http.get<any>(url);
  }

  getCalendariosWithToken(token:any, campeonato: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`,
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    const url = this.resourceUrl + '/listarConToken?campeonato=' + campeonato;
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

  getCalendariosByCampeonato(campeonato: any): Observable<any> {
    const url = this.resourceUrl + '/listarByCampeonato?campeonato=' + campeonato;
    return this.http.get<any>(url);
  }
}