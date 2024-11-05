import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';
import { NotificacionDTO } from 'src/app/modelo/NotificacionDTO';
import { UsuarioDTO } from 'src/app/modelo/UsuarioDTO';

import { NotificacionService } from 'src/app/servicios/notificacion.service';
import { SocketService } from 'src/app/servicios/socket.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
})
export class NotificacionesComponent implements OnInit {
  notificaciones: NotificacionDTO[] = [];
  idUsuario: number = Number(localStorage.getItem('userID'));
  mensajeError!: string;

  constructor(
    private notificacionService: NotificacionService,
    private userService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getnotificationsByIdUser(this.idUsuario);
    this.visualizarNotificacionesByUserID();
  }

  irADetalleNotificacion(notificacion: NotificacionDTO) {
    this.router.navigate(
      ['/detalleNotificacion', notificacion.idRedireccionamiento],
      {
        state: {
          carrera: notificacion.carrera,
          comentario: notificacion.comentario,
          usuario: notificacion.usuario,
          universidad: notificacion.universidad,
          permiso: notificacion.permiso,
          respuesta: notificacion.respuesta,
        },
      }
    );
  }

  getnotificationsByIdUser(idUsuario: number) {
    this.notificacionService.getNotificacionesByUserId(idUsuario).subscribe(
      (notificaciones: NotificacionDTO[]) => {
        this.notificaciones = notificaciones;
      },
      (error) => {
        console.error('Error al obtener las notificaciones:', error);
      }
    );
  }


  getNotificaciones() {
    this.notificacionService
      .getNotificaciones()
      .pipe(
        catchError((error: string) => {
          this.mensajeError = error;
          return EMPTY;
        })
      )
      .subscribe({
        next: (notificaciones) => {
          console.log(notificaciones);
        },
      });
  }

  getNotificacionById(id: number) {
    this.notificacionService
      .getNotificacionById(id)
      .pipe(
        catchError((eror: string) => {
          this.mensajeError = eror;
          return EMPTY;
        })
      )
      .subscribe({
        next: (notificacion) => {
          console.log(notificacion);
        },
      });
  }


  crearNotificacion(
    informacion?: string,
    idRedireccionamiento?: string,
    listaUsuarios?: UsuarioDTO[],
    leida?: boolean
  ) {
    const notificacionCreada: NotificacionDTO = {
      informacion: informacion,
    };
    this.notificacionService
      .crearNotificacion(notificacionCreada)
      .pipe(
        catchError((error: string) => {
          this.mensajeError = error;
          return EMPTY;
        })
      )
      .subscribe({
        next: (notificacion) => {
          console.log(notificacion);
        },
      });
  }

  eliminarNotificacion(notificacion: NotificacionDTO) {
    if (notificacion && notificacion.listaUsuariosIds) {
      this.actualizarListaUsuariosIds(notificacion);
    }
  }

  visualizarNotificacionesByUserID() {
    if (this.notificaciones) {
      this.notificaciones.forEach((notificacion) => {
        if (notificacion.listaUsuariosIds) {
          this.actualizarListaUsuariosIds(notificacion);
        }
      });
    }
  }

  // Método para actualizar la lista de IDs de usuarios
  private actualizarListaUsuariosIds(notificacion: NotificacionDTO) {
    if (notificacion.listaUsuariosIds) {
      const nuevoListaUsuariosIds = notificacion.listaUsuariosIds.filter(id => id !== this.idUsuario);

      // Solo actualiza si hay cambios en la lista
      if (nuevoListaUsuariosIds.length !== notificacion.listaUsuariosIds.length) {
        notificacion.listaUsuariosIds = nuevoListaUsuariosIds;

        this.notificacionService.editNotificacion(notificacion).subscribe(
          () => {
            this.getnotificationsByIdUser(this.idUsuario);
          },
          (error) => {
            console.error('Error al actualizar la notificación:', error);
          }
        );
      }
    }
  }

}
