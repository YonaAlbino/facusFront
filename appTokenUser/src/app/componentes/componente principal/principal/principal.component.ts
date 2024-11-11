import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthLoguinResponseDTO } from 'src/app/modelo/auth-loguin-response-dto';
import { PruebaService } from 'src/app/servicios/prueba.service';
import { SocketService } from 'src/app/servicios/socket.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { UtilService } from 'src/app/servicios/util.service';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(private socketService: SocketService, private userService: UsuarioService, private util:UtilService) { }

  role = localStorage.getItem('userRole');

  ngOnInit(): void {
    //window.location.reload();
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token');
    let role = urlParams.get('role');
    let idUsuaruio = urlParams.get('idUsuario');


    if (token && role && idUsuaruio) {
      console.log(token+" "+role+" "+idUsuaruio)
      const authLoguinResponseDTO:AuthLoguinResponseDTO = {
        role:role,
        token:token,
        id:Number(idUsuaruio)
      }
     // console.log(authLoguinResponseDTO.role)
      this.util.agregarCredencialesASesion(authLoguinResponseDTO);
      // localStorage.setItem('authToken', token!);
      // localStorage.setItem('userRole', role!);
      // localStorage.setItem('userID', idUsuaruio!);
      // this.userService.setUserId(Number(localStorage.getItem('userID')));
      // this.userService.setRolUsuario(localStorage.getItem('userRole')!);
    }

    
  }
}






