import { Component, OnInit } from '@angular/core';
import { NotificacionDTO } from 'src/app/modelo/NotificacionDTO';
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
  //idUser: number = Number(localStorage.getItem('userID'));
  private idUsuario:number | undefined;
  
  constructor(private webSocketService: SocketService,
    private notificacionesService: NotificacionService,
    private usuarioService: UsuarioService, private usarioService:UsuarioService) { }

  ngOnInit(): void {
    this.usuarioService.idUsuarioActual.subscribe(idUsuario => {
      if (idUsuario !== null) {
        this.escucharSocket(idUsuario);
        this.notificacionesService.getNotificacionesNoLeidas(idUsuario)
          .subscribe((notificaciones: NotificacionDTO[]) => {
            this.notificaciones = notificaciones.length;
          });
      }
    })
  }

  escucharSocket(idUser:number) {
    this.webSocketService.getMessages("/tema/admin/notificacion").subscribe((mensaje) => {
      //this.messages.push(mensaje);
      this.notificaciones++;
    });

    this.webSocketService.getMessages("/tema/usuario/" + idUser).subscribe((mensaje) => {
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
