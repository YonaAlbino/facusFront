import { Component } from '@angular/core';
import { AuthLoguinResponseDTO } from 'src/app/modelo/auth-loguin-response-dto';
import { UtilService } from 'src/app/servicios/util.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  constructor(private util: UtilService) { }

  role = localStorage.getItem('userRole');

  ngOnInit(): void {
    //window.location.reload();
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token');
    let role = urlParams.get('role');
    let idUsuaruio = urlParams.get('idUsuario');


    if (token && role && idUsuaruio) {
      console.log(token + " " + role + " " + idUsuaruio)
      const authLoguinResponseDTO: AuthLoguinResponseDTO = {
        role: role,
        token: token,
        id: Number(idUsuaruio)
      }

      this.util.agregarCredencialesASesion(authLoguinResponseDTO);
    }
  }
}
