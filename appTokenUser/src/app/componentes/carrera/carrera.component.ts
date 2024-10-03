import { Component } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { Calificacion } from 'src/app/modelo/calificacion';
import { Carrera } from 'src/app/modelo/carrera';
import { Comentario } from 'src/app/modelo/comentario';
import { CarreraService } from 'src/app/servicios/carrera.service';

@Component({
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.css']
})
export class CarreraComponent {

  constructor(private carreraService: CarreraService) { }

   mensajeError!: string;

  getCarreras() {
    this.carreraService.getCarreras()
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (carreras) => {
          console.log(carreras);
        }
      })
  }

  getCarreraById(id: number) {
    this.carreraService.getCarreraByID(id)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (carrera) => {
          console.log(carrera);
        }
      })
  }

  crearCarrera(nombre: string, grado?: string, duracion?: string, activa?: boolean, listaComentarios?: Comentario[], listaCalificacion?: Calificacion[]) {
    const carrera: Carrera = {
      nombre: nombre,
      grado: grado,
      duracion: duracion,
      activa: activa,
      listaComentarios: listaComentarios,
      listaCalificacion: listaCalificacion
    }
    this.carreraService.crearCarrera(carrera)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (carrera) => {
          console.log(carrera);
        }
      })
  }

  editCarrera(id:number, nombre?: string, grado?: string, duracion?: string, activa?: boolean, listaComentarios?: Comentario[], listaCalificacion?: Calificacion[]) {
    const carrera: Carrera = {
      id:id,
      nombre: nombre,
      grado: grado,
      duracion: duracion,
      activa: activa,
      listaComentarios: listaComentarios,
      listaCalificacion: listaCalificacion
    }
    this.carreraService.editCarrera(carrera)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (carrera) => {
          console.log(carrera);
        }
      })
  }

}
