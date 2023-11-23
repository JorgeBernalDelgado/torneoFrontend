import { Component } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title = 'torneo';

  rutaEstadioFutbol = "assets/img/estadio_foto.jpg";
}