import { Component, OnInit } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { Comentario } from 'src/app/modelo/comentario';
import { Reaccion } from 'src/app/modelo/reaccion';
import { Usuario } from 'src/app/modelo/usuario';
import { ComentarioService } from 'src/app/servicios/comentario.service';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrls: ['./comentario.component.css']
})
export class ComentarioComponent implements OnInit {

  constructor(private comentarioService: ComentarioService) { }

  comentarios: Comentario[] = [];
  mensajeError!: string;

  ngOnInit(): void {
    this.comentarioService.getComentarios()
      .pipe(
        catchError((error: string) => {
          this.mensajeError = error;
          return EMPTY;
        })
      ).subscribe({
        next: (comentarios) => {
          this.comentarios = comentarios;
        }
      })

  }

  deleteComentarioById(id: number) {
    this.comentarioService.eliminarComentario(id)
      .pipe(catchError(
        (error: string) => {
          this.mensajeError = error;
          return EMPTY;
        }
      )).subscribe(
        {
          next: (respuesta) => {
            console.log(respuesta);
          }
        }
      )
  }

  getComentariosById(id: number) {
    this.comentarioService.getComentarioById(id)
      .pipe(
        catchError((error: string) => {
          this.mensajeError = error;
          return EMPTY;
        })
      ).subscribe({
        next: (comentario) => {
          console.log('Comentario guardado:', comentario);
        }
      });
  }

  guardarComentario(mensaje: string) {
    const comentarioAGuardar: Comentario = {
      mensaje: mensaje,
      fecha: new Date().toISOString()
    }
    this.comentarioService.guardarComentario(comentarioAGuardar)
      .pipe(
        catchError((error: string) => {
          this.mensajeError = error; // Guardar el mensaje de error en una propiedad
          return EMPTY; // Retornar un observable vacío en caso de error
        })
      )
      .subscribe({
        next: (comentario) => {
          console.log('Comentario guardado:', comentario);
        }
      });
  }

  editComentario(id: number, mensaje?:string, fecha?:string, listaReaccion?: Reaccion[], listaComentario?: Comentario[], usuario?: Usuario) {
    const comentarioEdit: Comentario = {
      id: id,
      fecha: fecha,
      mensaje:mensaje,
      listaReaccion: listaReaccion,
      listaComentario: listaComentario,
      usuario: usuario
    }

    this.comentarioService.editComentario(comentarioEdit)
      .pipe(
        catchError((error: string) => {
          this.mensajeError = error;
          return EMPTY;
        })
      )
      .subscribe({
        next: (comentario) => {
          console.log(comentario);
        }
      })
  }

}
