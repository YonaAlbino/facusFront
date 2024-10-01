import { Component, OnInit } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { Comentario } from 'src/app/modelo/comentario';
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
    this.comentarioService.guardarComentario(mensaje)
      .pipe(
        catchError((error: string) => {
          this.mensajeError = error; // Guardar el mensaje de error en una propiedad
          return EMPTY; // Retornar un observable vacío en caso de error
        })
      )
      .subscribe({
        next: (comentario) => {
          console.log('Comentario guardado:', comentario);
          // Aquí puedes agregar lógica adicional después de guardar el comentario
        }
      });
  }
}
