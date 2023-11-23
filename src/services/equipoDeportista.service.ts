import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BackendURL } from "src/shared/constants/app.constants";

@Injectable({ providedIn: 'root' })
export class EquipoDeportistaService {
  public resourceUrl = BackendURL + 'api/equiposDeportistas';

  constructor(private http: HttpClient) {}

  getEquipoDeportistaByCampeonato(torneo: any, jugador: any, token?: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    const url = this.resourceUrl + '/listarEquipoDeportistasByCampeonato?torneo=' + torneo + '&jugador=' + jugador;
    return this.http.get<any>(url, {headers});
  }

  getEquipoDeportistaByEquipo(equipo: any, campeonato: any, token?: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT"
    });
    const url = this.resourceUrl + '/listarEquipoDeportistasByEquipo?equipo=' + equipo + '&campeonato=' + campeonato;
    return this.http.get<any>(url, {headers});
  }

  getDeportistaAnotaciones(torneo: any): Observable<any> {
    const url = this.resourceUrl + '/listarDeportistaAnotaciones?torneo=' + torneo;
    return this.http.get<any>(url);
  }

  getVallaMenosVencida(torneo: any): Observable<any> {
      const url = this.resourceUrl + '/listarVallaMenosVencida?torneo=' + torneo;
      return this.http.get<any>(url);
  }

}