import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { TokenStorageService } from 'src/services/tokenStorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  rutaImagenFutbol = "assets/img/foto_login.jpg";
  
  constructor(private authService: AuthService, 
    private tokenStorage: TokenStorageService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }
  onSubmit(): void {
    const { username, password } = this.form;
    const paramMap = {
      client_id: username,
      client_secret: "secret",
      password: password,
      user: username
    };
    this.authService.login(paramMap.user,paramMap.password).subscribe(
      data => {
        const userSesion = {
          user_id: data.idUsuario,
          //roles:["nombre:`'${data.authorities[0].authority}'`"],
          roles:{
            nombre:data.authorities[0].authority
          },
          user: data.usuario
        };
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(userSesion);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = data.roles;     
        // setTimeout(function(){
        //   this.reloadPage();
        // }, 50); 
        this.reloadPage();
      },
      err => {
        if(err.error === 'Bad credentials'){
          this.showError('Contraseña erronea');
        }
        else if(err.error === 'No value present'){
          this.showError('Usuario no existe!');
        }else{
          this.showError('error interno');
        }
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }
  reloadPage(): void {
    this.router.navigate(['/']);
    setTimeout(function(){
      window.location.reload();
    }, 500); 
  }

  showError(mensaje:any) {
    this.messageService.add({key: 'c',severity:'error', summary: 'Error', detail: mensaje});
  }
}