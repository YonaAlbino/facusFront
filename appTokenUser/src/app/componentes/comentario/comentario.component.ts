import { Component, Input, OnInit } from '@angular/core';
import { catchError, EMPTY, Observable } from 'rxjs';
import { CarreraDTO } from 'src/app/modelo/CarreraDTO';
import { ComentarioDTO } from 'src/app/modelo/ComentarioDTO';
import { ReaccionDTO } from 'src/app/modelo/ReaccionDTO';
import { RespuestaDTO } from 'src/app/modelo/RespuestaDTO';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';
import { UsuarioDTO } from 'src/app/modelo/UsuarioDTO';

import { CarreraService } from 'src/app/servicios/carrera.service';
import { ComentarioService } from 'src/app/servicios/comentario.service';
import { ReaccionService } from 'src/app/servicios/reaccion.service';
import { RespuestaService } from 'src/app/servicios/respuesta.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrls: ['./comentario.component.css'],
})
export class ComentarioComponent implements OnInit {
  eliminarComentario() {
    throw new Error('Method not implemented.');
  }
  constructor(
    private carreraService: CarreraService,
    private userService: UsuarioService,
    private comentarioService: ComentarioService,
    private respuestaService: RespuestaService,
    private reaccionService: ReaccionService
  ) { }

  respuestaDeLaRespuestaDelComentario: string | undefined;
  comentario: string | undefined;
  respuestaDesdeElInput: string | undefined;
  listaComentarios: ComentarioDTO[] = [];
  verComentarios: boolean = true;
  paginaActual: number = 0;
  cantidadRegistros: number = 10;
  edicionComentario: string | undefined;

  @Input() Universidad: UniversidadDTO | undefined;
  @Input() carrera: CarreraDTO | undefined;
  idUsuarioActual: number | undefined;

  ngOnInit(): void {

    this.userService.idUsuarioActual.subscribe(idUsuario => {
      if (idUsuario !== null)
        this.idUsuarioActual = idUsuario;
    });
    //console.log(this.idUsuarioActual);
    this.comentarioService.getComentarios().subscribe({
      // next: (comentarios) => {
      //   // this.comentarios = comentarios;
      // },
    });

    if (this.carrera) {
      this.CargarComentariosPaginadosCarrera();
    }

    if (this.Universidad) {
      this.CargarComentariosPaginadosUniversidad();
    }
  }

  //Metodo para crear una nueva instancia de un Comentario
  crearComentario(mensaje: string): ComentarioDTO {
    let nuevoComentario: ComentarioDTO = {
      mensaje: mensaje,
    };
    return nuevoComentario;
  }


  //Metodo para actualizar la lista de respuestas del comentario
  actualizarComentario(comentarioAguardar: ComentarioDTO) {
    this.comentarioService.editComentario(comentarioAguardar).subscribe(
      (comentario: ComentarioDTO) => {
        console.log('comentario guardado ' + comentario);
      }
    );
  }

  //Metodo para actualizar la lista de respuestas del la respuesta de un comentario
  actualizarRespuesta(respuestaAguardar: RespuestaDTO) {
    this.respuestaService.actualizarRespuesta(respuestaAguardar).subscribe(
      (respuesta: RespuestaDTO) => { },
      (error) => {
        console.error(error);
      }
    );
  }

  //Metodo para mostrar o no las respuestas de cada comentario
  toggleRespuestas(comentario: ComentarioDTO) {
    comentario.mostrarRespuestas = !comentario.mostrarRespuestas;
  }

  //Metodo para mostrar o no las respuestas de cada respuesta
  toggleRespuestasDelComentario(respuesta: RespuestaDTO) {
    respuesta.mostrarRespuestas = !respuesta.mostrarRespuestas;
  }

  //metodo para responder a la respuesta del comentario
  responderRespuestas(respuesta: RespuestaDTO) {
    respuesta.mostrarFormularioRespuesta =
      !respuesta.mostrarFormularioRespuesta;
  }

  //metodo para responder al comentario
  responderComentario(comentario: ComentarioDTO) {
    console.log(comentario)
    comentario.mostrarFormularioRespuesta =
      !comentario.mostrarFormularioRespuesta;
  }

  //metodo para mostrar campo de texto para editar el comentario
  public editarComentario(comentario: ComentarioDTO) {
    this.rellenarCampoTexto(comentario.mensaje!);
    comentario.mostrarFormularioEdicion =
      !comentario.mostrarFormularioEdicion;
  }

  //metodo que coloca el mensaje del comentario a editar en el campo de texo
  public rellenarCampoTexto(texto: string) {
    this.edicionComentario = texto;
  }

  //metodo envio del comentario a editar al back
  public enviarComentarioEditado(comentario: ComentarioDTO) {
    comentario.mensaje = this.edicionComentario;
    this.comentarioService.editComentario(comentario).subscribe((comentario: ComentarioDTO) => {
      console.log(comentario);
    })
  }

  //Meotodo para guardar la respuesta de la respuesta del comentario
  guardarRespuestaDelComen(respuesta: RespuestaDTO) {
    this.crearRespuesta(this.respuestaDeLaRespuestaDelComentario!).subscribe(
      (respuestaGuardada: RespuestaDTO) => {
        respuesta.listaRespuesta?.push(respuestaGuardada);
        this.actualizarRespuesta(respuesta);
      },
      (error) => {
        console.error(error);
      }
    );

    this.respuestaDeLaRespuestaDelComentario = '';
    respuesta.mostrarFormularioRespuesta = false;
  }

  //Metodo para guardar la respuesta del comentario
  guardarRespuesta(comentario: ComentarioDTO) {
    this.crearRespuesta(this.respuestaDesdeElInput!).subscribe(
      (respuesta: RespuestaDTO) => {
        // respuesta.listaRespuesta = [];
        comentario.listaRespuesta?.push(respuesta);
        this.actualizarComentario(comentario);
      }
    );

    this.respuestaDesdeElInput = '';
    comentario.mostrarFormularioRespuesta = false;
  }

  //Metodo para crear una nueva instancia de una Respuesta
  crearRespuesta(mensaje: string): Observable<RespuestaDTO> {
    // const usuario: Usuario = {
    //   id: Number(localStorage.getItem('userID'))
    // };

    let nuevaRespuesta: RespuestaDTO = {
      mensaje: mensaje,
      fecha: new Date().toISOString(),
      //usuario: usuario
    };
    return this.respuestaService.guardarRespuesta(nuevaRespuesta, this.idUsuarioActual!);
  }


  traerComentariosMasRecientes() {
    // Asegúrate de que listaComentarios no esté vacío
    if (!this.listaComentarios.length) return;

    // Filtrar comentarios con fechas válidas
    const comentariosConFechasValidas = this.listaComentarios.filter(comment => comment.fecha !== undefined && comment.fecha !== null);

    // Ordenar la lista de comentarios por fecha de manera descendente
    comentariosConFechasValidas.sort((a, b) => {
      const fechaA = new Date(a.fecha!); // Asegúrate de que fechaA no sea null o undefined
      const fechaB = new Date(b.fecha!);

      return fechaB.getTime() - fechaA.getTime();
    });

    // Opcional: Si deseas reemplazar la lista original con la ordenada
    this.listaComentarios = comentariosConFechasValidas;
  }

  // Método para ordenar la lista de comentarios de más antiguos a más recientes
  traerComentariosMasAntiguos() {
    // Asegúrate de que listaComentarios no esté vacío
    if (!this.listaComentarios.length) return;

    // Filtrar comentarios con fechas válidas
    const comentariosConFechasValidas = this.listaComentarios.filter(comment => comment.fecha !== undefined && comment.fecha !== null);

    // Ordenar la lista de comentarios por fecha de manera ascendente
    comentariosConFechasValidas.sort((a, b) => {
      const fechaA = new Date(a.fecha!); // Asegúrate de que fechaA no sea null o undefined
      const fechaB = new Date(b.fecha!);

      return fechaA.getTime() - fechaB.getTime();
    });

    // Opcional: Si deseas reemplazar la lista original con la ordenada
    this.listaComentarios = comentariosConFechasValidas;
  }


  //Metodo para ocultar los comentarios
  ocultarComentarios() {
    this.verComentarios = !this.verComentarios;
  }

  //Metodo para cargar comentarios paginados
  CargarComentariosPaginadosUniversidad() {
    this.comentarioService
      .CargarComentariosPaginadosUniversidad(
        this.paginaActual,
        this.cantidadRegistros,
        this.Universidad!.id!
      )
      .subscribe(
        (listaComentarios: ComentarioDTO[]) => {
          this.listaComentarios = listaComentarios;
          this.paginaActual++;
        },
        (error) => console.error(error)
      );

    this.desplazarVista();
  }

  //Metodo para cargar comentarios paginados
  CargarComentariosPaginadosCarrera() {
    console.log(this.carrera!.id);
    this.comentarioService
      .CargarComentariosPaginadosCarrera(
        this.paginaActual,
        this.cantidadRegistros,
        this.carrera!.id!
      )
      .subscribe(
        (listaComentarios: ComentarioDTO[]) => {
          this.listaComentarios = listaComentarios;
          this.paginaActual++;
        },
        (error) => console.error(error)
      );

    this.desplazarVista();
  }

  // Desplazar la vista del usuario al contenedor de comentarios
  desplazarVista() {
    const comentariosContainer = document.getElementById(
      'comentariosContainer'
    );
    if (comentariosContainer) {
      comentariosContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  //Metodo para recargar los comentarios
  recargarComentarios() {
    this.paginaActual = 0;
    if (this.carrera) {
      this.CargarComentariosPaginadosCarrera();
    }

    if (this.Universidad) {
      this.CargarComentariosPaginadosUniversidad();
    }
  }

  //Metodo para cargar comentarios tanto de universidad o carrera
  cargarComentarios() {
    if (this.carrera) {
      this.CargarComentariosPaginadosCarrera();
    }

    if (this.Universidad) {
      this.CargarComentariosPaginadosUniversidad();
    }
  }

  //Metodo para añadir reacion de megusta
  megusta(comentario: ComentarioDTO) {
    console.log(comentario);
    this.reaccionService
      .guardarReaccion(this.crearReaccion(1))
      .subscribe((reaccion: ReaccionDTO) => {
        comentario.listaReaccion?.push(reaccion);
        this.actualizarComentario(comentario);
      });
  }

  //Metodo para crear una  instancia de una reaccion
  crearReaccion(megustaNoMeGusta: number): ReaccionDTO {
    let reaccion: ReaccionDTO = {}; // Inicializa como un objeto vacío
    if (megustaNoMeGusta === 1) reaccion.meGusta = 1;
    if (megustaNoMeGusta === 0) reaccion.noMegusta = 1;
    return reaccion;
  }

  //Metodo para añadir reaccion de no me gusta
  noMeGusta(comentario: ComentarioDTO) {
    this.reaccionService
      .guardarReaccion(this.crearReaccion(0))
      .subscribe((reaccion: ReaccionDTO) => {
        comentario.listaReaccion?.push(reaccion);
        this.actualizarComentario(comentario);
      });
  }

  calcularSumaMeGusta(comentarios: any[]): number {
    let suma = 0;
    comentarios.forEach((comentario) => {
      suma += comentario.meGusta;
    });
    return suma;
  }

  calcularSumaNoMeGusta(comentarios: any[]): number {
    let suma = 0;
    comentarios.forEach((comentario) => {
      suma += comentario.noMegusta;
    });
    return suma;
  }

  megustaRespuesta(respuesta: RespuestaDTO) {
    console.log('oeoe');
    this.reaccionService
      .guardarReaccion(this.crearReaccion(1))
      .subscribe((reaccion: ReaccionDTO) => {
        respuesta.listaReaccion?.push(reaccion);
        this.actualizarRespuesta(respuesta);
      });
  }

  noMeGustaRespuesta(respuesta: RespuestaDTO) {
    this.reaccionService
      .guardarReaccion(this.crearReaccion(0))
      .subscribe((reaccion: ReaccionDTO) => {
        respuesta.listaReaccion?.push(reaccion);
        this.actualizarRespuesta(respuesta);
      });
  }

  deleteComentarioById(id: number) {
    this.comentarioService
      .eliminarComentario(id)
      .pipe(
        catchError((error: string) => {
          // this.mensajeError = error;
          return EMPTY;
        })
      )
      .subscribe({
        next: (respuesta) => {
          console.log(respuesta);
        },
      });
  }

  getComentariosById(id: number) {
    this.comentarioService
      .getComentarioById(id)
      .pipe(
        catchError((error: string) => {
          // this.mensajeError = error;
          return EMPTY;
        })
      )
      .subscribe({
        next: (comentario) => {
          console.log('Comentario guardado:', comentario);
        },
      });
  }

  guardarComentario(mensaje: string) {
    const comentarioAGuardar: ComentarioDTO = {
      mensaje: mensaje,
      fecha: new Date().toISOString(),
    };
    this.comentarioService
      .guardarComentario(comentarioAGuardar, Number(this.idUsuarioActual))
      .pipe(
        catchError((error: string) => {
          //this.mensajeError = error; // Guardar el mensaje de error en una propiedad
          return EMPTY; // Retornar un observable vacío en caso de error
        })
      )
      .subscribe({
        next: (comentario) => {
          console.log('Comentario guardado:', comentario);
        },
      });
  }

  editComentario(
    id: number,
    mensaje?: string,
    fecha?: string,
    listaReaccion?: ReaccionDTO[],
    listaComentario?: ComentarioDTO[],
    usuario?: UsuarioDTO
  ) {
    const comentarioEdit: ComentarioDTO = {
      id: id,
      fecha: fecha,
      mensaje: mensaje,
      listaReaccion: listaReaccion,
      //listaComentario: listaComentario,
      usuario: usuario,
    };

    this.comentarioService
      .editComentario(comentarioEdit)
      .pipe(
        catchError((error: string) => {
          // this.mensajeError = error;
          return EMPTY;
        })
      )
      .subscribe({
        next: (comentario) => {
          console.log(comentario);
        },
      });
  }
}
