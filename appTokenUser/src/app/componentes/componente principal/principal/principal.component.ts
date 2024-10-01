import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { PruebaService } from 'src/app/servicios/prueba.service';
import { SocketService } from 'src/app/servicios/socket.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(private socketService: SocketService, private userService: UsuarioService) { }

  role = localStorage.getItem('userRole');

  ngOnInit(): void {
    //window.location.reload();
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token');
    let role = urlParams.get('role');
    let idUsuaruio = urlParams.get('idUsuario');


    if (token && role && idUsuaruio) {
      localStorage.clear();
      localStorage.setItem('authToken', token!);
      localStorage.setItem('userRole', role!);
      localStorage.setItem('userID', idUsuaruio!);
      this.userService.setUserId(Number(localStorage.getItem('userID')));
      this.userService.setRolUsuario(localStorage.getItem('userRole')!);
    }

    
  }
}






