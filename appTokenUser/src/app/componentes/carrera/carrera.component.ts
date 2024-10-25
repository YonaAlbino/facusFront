import { Component, Input } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { CalificacionDTO } from 'src/app/modelo/calificacion';
import { CarreraDTO } from 'src/app/modelo/CarreraDTO';
import { ComentarioDTO } from 'src/app/modelo/ComentarioDTO';

import { CarreraService } from 'src/app/servicios/carrera.service';

@Component({
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.css']
})
export class CarreraComponent {

  constructor(private carreraService: CarreraService) { }
  @Input() carrera!: CarreraDTO;

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

  crearCarrera(nombre: string, grado?: string, duracion?: string, activa?: boolean, listaComentarios?: ComentarioDTO[], listaCalificacion?: CalificacionDTO[]) {
    const carrera: CarreraDTO = {
      nombre: nombre,
      grado: grado,
      duracion: duracion,
      activa: activa,
      listaComentario: listaComentarios,
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

  editCarrera(id:number, nombre?: string, grado?: string, duracion?: string, activa?: boolean, listaComentarios?: ComentarioDTO[], listaCalificacion?: CalificacionDTO[]) {
    const carrera: CarreraDTO = {
      id:id,
      nombre: nombre,
      grado: grado,
      duracion: duracion,
      activa: activa,
      listaComentario: listaComentarios,
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
