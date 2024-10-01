import { Component, OnInit } from '@angular/core';
import { Notificacion } from 'src/app/modelo/notificacion';
import { NotificacionService } from 'src/app/servicios/notificacion.service';
import { SocketService } from 'src/app/servicios/socket.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {

  notificaciones: Notificacion[] = [];
  idUsuario: number = Number(localStorage.getItem('userID'));

  constructor(private notificacionService: NotificacionService, private userService:UsuarioService) { }

  ngOnInit(): void {
    this.getnotificationsByIdUser(this.idUsuario);
    this.visualizarNotificacionesByUserID();
  }

  eliminarNotificacion(idNotificacion: number | undefined, idUsuario: number | undefined) {
    if(idNotificacion && idUsuario){
      this.notificacionService.eliminarUsuarioAsignado(idNotificacion, idUsuario).subscribe(
        response => {
          //console.log('Respuesta del servidor:', response);
          this.getnotificationsByIdUser(this.idUsuario);
          // Aquí puedes manejar la respuesta, por ejemplo, mostrar un mensaje o actualizar la UI
        },
        (error) => {
          console.error('Error al eliminar la notificación:', error);
        }
      );
    }else {
      console.error("Ids nulos", idNotificacion, idUsuario);
    }
  }

  getnotificationsByIdUser(idUsuario: number) {
    this.notificacionService.getNotificacionesByUserId(idUsuario).subscribe(
      (notificaciones: Notificacion[]) => {
        this.notificaciones = notificaciones;
      },
      (error) => {
        console.error('Error al obtener las notificaciones:', error);
      }
    )
  }

  visualizarNotificacionesByUserID(){
    this.notificacionService.visualizarNotificacionesByUserID(this.idUsuario)
      .subscribe((respuesta:string) => {
        //this.getnotificationsByIdUser(this.idUsuario);
        this.userService.setUserId(this.idUsuario);
      },
    (error) => {
      console.error("Hubo un error al intentar marcar las notificaciones como 'vistas'", error);
    });
  }
}
