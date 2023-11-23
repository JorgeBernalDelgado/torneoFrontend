import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { BackendURL } from 'src/shared/constants/app.constants';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }
  public AUTH_API = BackendURL + 'api/usuarios/';
  private authenticationState = new ReplaySubject<any>(1);

  grant_type = "client_credentials";

  // login(paramMap: any): Observable<any> {
  //   let body = `client_id=${paramMap.client_id}&client_secret=${paramMap.client_secret}&password=${paramMap.password}&user=${paramMap.user}`;
  //   return this.http.post(AUTH_API + 'signin?grant_type=' + this.grant_type, 
  //   body, httpOptions);
  // }

  login(user: any, pass: any): Observable<any> {
    const url = this.AUTH_API + 'signin?usuario=' + user+'&contrasena='+pass;
    return this.http.get<any>(url);
  }

  getAuthenticationState(): Observable<any> {
    return this.authenticationState.asObservable();
  }

}