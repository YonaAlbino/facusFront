import { Component, OnInit } from '@angular/core';
import { Notificacion } from 'src/app/modelo/notificacion';
import { NotificacionService } from 'src/app/servicios/notificacion.service';

import { SocketService } from 'src/app/servicios/socket.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-esucha-socket',
  templateUrl: './esucha-socket.component.html',
  styleUrls: ['./esucha-socket.component.css']
})
export class EsuchaSocketComponent implements OnInit {

  // public messages: string[] = [];
  public notificaciones: number = 0;
  idUser: number = Number(localStorage.getItem('userID'));
  private idUsuario:number | undefined;
  
  constructor(private webSocketService: SocketService,
    private notificacionesService: NotificacionService,
    private usuarioService: UsuarioService, private usarioService:UsuarioService) { }

  ngOnInit(): void {
    this.escucharSocket();
    this.usuarioService.idUsuarioActual.subscribe(idUsuario => {
      if (idUsuario !== null) {
        this.notificacionesService.getNotificacionesNoLeidas(idUsuario)
          .subscribe((notificaciones: Notificacion[]) => {
            this.notificaciones = notificaciones.length;
          });
      }
    })
  }

  escucharSocket() {
    this.webSocketService.getMessages("/tema/admin/notificacion").subscribe((mensaje) => {
      //this.messages.push(mensaje);
      this.notificaciones++;
    });

    this.webSocketService.getMessages("/usuario/" + this.idUser).subscribe((mensaje) => {
      //this.messages.push(mensaje);
      this.notificaciones++;
    });
  }

  obtenerIdUsuario(){
    this.usarioService.idUsuarioActual.subscribe(id => {
      if(id){
        this.idUsuario = id;
      }
    })
  }
  
}
