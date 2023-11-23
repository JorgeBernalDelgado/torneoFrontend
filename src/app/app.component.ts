import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { TokenStorageService } from 'src/services/tokenStorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'torneo';
  usuarioEnSesion: any;
  sesionActiva = true;

  constructor(
    private router: Router,
    private authSeervice: AuthService
  ) { 
    
    
  }

  ngOnInit(): void {
    this.usuarioEnSesion = JSON.parse(sessionStorage.getItem("auth-user"));
    if(this.usuarioEnSesion){
      this.sesionActiva = true;
    }
    else{
      this.sesionActiva = false;
    }
    this.validarSesion(this.usuarioEnSesion);
  }

  validarSesion(usuario: any): void{
    if(usuario === null){
      this.usuarioEnSesion = {
        roles:{
          nombre:'ROL_GENERAL'
        }
      };
    }
  }

  cerrarSesion(): void{
    sessionStorage.removeItem('auth-user');
    sessionStorage.removeItem('auth-token');
    this.router.navigate(['/']);
    setTimeout(function(){
      this.reloadPage();
    }, 1000); 
  }

  reloadPage(): void {
    window.location.reload();
  }
}
