import { Component, Input, OnInit } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { CalificacionDTO } from 'src/app/modelo/calificacion';
import { CarreraDTO } from 'src/app/modelo/CarreraDTO';
import { ComentarioDTO } from 'src/app/modelo/ComentarioDTO';

import { CarreraService } from 'src/app/servicios/carrera.service';
import { ComentarioService } from 'src/app/servicios/comentario.service';

@Component({
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.css']
})
export class CarreraComponent {
  nuevoComentario: string = "";

  constructor(private carreraService: CarreraService, private comentarioService: ComentarioService) { }

  @Input() carrera!: CarreraDTO;

  crearNuevoComentario(comentario: string) {
    const nuevoComentario = this.crearComentario(comentario);
    this.guardarComentario(nuevoComentario);
    this.nuevoComentario = "";
  }

  private crearComentario(mensaje: string): ComentarioDTO {
    // const usuario: UsuarioDTO = {
    //     id: Number(localStorage.getItem('userID'))
    // };

    return {
      mensaje: mensaje,
      usuarioId: Number(localStorage.getItem('userID')),
      fecha: new Date().toISOString()
      //listaComentario: []
    };
  }

  private guardarComentario(comentario: ComentarioDTO): void {
    this.comentarioService.guardarComentario(comentario).subscribe(
      (comentarioGuardado: ComentarioDTO) => {
        // const comentario:ComentarioDTO = {
        //   id:comentarioGuardado.id,
        //   //fecha:new Date().toISOString()
        // }

        this.carrera.listaComentarios?.push(comentarioGuardado);
        this.actualizarCarrera(this.carrera);
      }
    );
  }
  actualizarCarrera(carrera:CarreraDTO) {
    this.carreraService.editCarrera(carrera)
      .subscribe((carreraEditada: CarreraDTO) => {
        console.log(this.carrera)
        this.carrera = carreraEditada;
      })
  }



  ngOnChanges(): void {

  }

  getCarreras() {
    this.carreraService.getCarreras().subscribe({
      next: (carreras) => {
        console.log(carreras);
      }
    })
  }

  getCarreraById(id: number) {
    this.carreraService.getCarreraByID(id)
      .subscribe({
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
      listaComentarios: listaComentarios,
      listaCalificacion: listaCalificacion
    }
    this.carreraService.crearCarrera(carrera)
      .subscribe({
        next: (carrera) => {
          console.log(carrera);
        }
      })
  }

  editCarrera(id: number, nombre?: string, grado?: string, duracion?: string, activa?: boolean, listaComentarios?: ComentarioDTO[], listaCalificacion?: CalificacionDTO[]) {
    const carrera: CarreraDTO = {
      id: id,
      nombre: nombre,
      grado: grado,
      duracion: duracion,
      activa: activa,
      listaComentarios: listaComentarios,
      listaCalificacion: listaCalificacion
    }
    this.carreraService.editCarrera(carrera)
      .subscribe({
        next: (carrera) => {
          console.log(carrera);
        }
      })
  }

}
