import { Component } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { Calificacion } from 'src/app/modelo/calificacion';
import { Comentario } from 'src/app/modelo/comentario';
import { Reaccion } from 'src/app/modelo/reaccion';
import { RefreshToken } from 'src/app/modelo/refresh-token';
import { Rol } from 'src/app/modelo/rol';
import { Universidad } from 'src/app/modelo/universidad';
import { Usuario } from 'src/app/modelo/usuario';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {
  mensajeError!: string;

  constructor(private usuarioService: UsuarioService) { }

  getUsuarios() {
    this.usuarioService.getUsuarios()
      .pipe(
        catchError((error: string) => {
          this.mensajeError = error;
          return EMPTY;
        })
      ).subscribe({
        next: (usuarios) => {
          console.log(usuarios);
        }
      })
  }

  getUsuarioById(id: number) {
    this.usuarioService.getUsuarioById(id)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (usuario) => {
          console.log(usuario);
        }
      })
  }

  crearUsuario(nombreUsuario: string, contrasenia: string) {
    const usuarioAGuardar: Usuario = {
      username: nombreUsuario,
      password: contrasenia
    }

    this.usuarioService.crearUsuario(usuarioAGuardar)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (usuario) => {
          console.log(usuario);
        }
      })
  }

  editUsuario(
    id: number,
    username?: string,
    password?: string,
    enable?: boolean,
    accountNotExpired?: boolean,
    accountNotLocked?: boolean,
    credentialNotExpired?: boolean,
    listaRoles?: Rol[],
    listaUniversidad?: Universidad[],
    listaCalificacion?: Calificacion[],
    refreshToken?: RefreshToken,
    listaComentarios?: Comentario[],
    listaReaccion?: Reaccion[]
  ) {
    const usuarioEdit: Usuario = {
      id: id,
      username: username || '',
      password: password || '',
      enable: enable ?? true,
      accountNotExpired: accountNotExpired ?? true,
      accountNotLocked: accountNotLocked ?? true,
      credentialNotExpired: credentialNotExpired ?? true,
      listaRoles: listaRoles || [],
      listaUniversidad: listaUniversidad || [],
      listaCalificacion: listaCalificacion || [],
      refreshToken: refreshToken,
      listaComentarios: listaComentarios || [],
      listaReaccion: listaReaccion || []
    };

    this.usuarioService.editUsuario( usuarioEdit)
    .pipe(catchError((error:string) => {
      this.mensajeError = error;
      return EMPTY;
    })).subscribe({
      next:(usuario) => {
        console.log(usuario);
      }
    })
}


}
