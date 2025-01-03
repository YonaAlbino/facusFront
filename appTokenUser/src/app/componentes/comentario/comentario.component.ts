import { Component, Input, OnInit } from '@angular/core';
import { catchError, EMPTY, Observable } from 'rxjs';
import { CarreraDTO } from 'src/app/modelo/CarreraDTO';
import { ComentarioDTO } from 'src/app/modelo/ComentarioDTO';
import { ImagenUsuario } from 'src/app/modelo/imagen-usuario';
import { ReaccionDTO } from 'src/app/modelo/ReaccionDTO';
import { RespuestaDTO } from 'src/app/modelo/RespuestaDTO';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';
import { UsuarioDTO } from 'src/app/modelo/UsuarioDTO';

import { CarreraService } from 'src/app/servicios/carrera.service';
import { ComentarioService } from 'src/app/servicios/comentario.service';
import { ReaccionService } from 'src/app/servicios/reaccion.service';
import { RespuestaService } from 'src/app/servicios/respuesta.service';
import { UniversidadService } from 'src/app/servicios/universidad.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrls: ['./comentario.component.css'],
})
export class ComentarioComponent implements OnInit {
  imagenUsuario: string | undefined;


  eliminarComentario() {
    throw new Error('Method not implemented.');
  }
  constructor(
    private carreraService: CarreraService,
    private userService: UsuarioService,
    private comentarioService: ComentarioService,
    private respuestaService: RespuestaService,
    private reaccionService: ReaccionService,
    private universidadService: UniversidadService
  ) { }

  respuestaDeLaRespuestaDelComentario: string | undefined;
  comentario: string | undefined;
  respuestaDesdeElInput: string | undefined;
  listaComentarios: ComentarioDTO[] = [];
  verComentarios: boolean = true;
  paginaActual: number = 0;
  cantidadRegistros: number = 10;
  edicionComentario: string | undefined;
  edicionRespuesta: string | undefined;
  cantidadComentarios: Number | undefined;

  @Input() Universidad: UniversidadDTO | undefined;
  @Input() carrera: CarreraDTO | undefined;
  idUsuarioActual: number | undefined;

  ngOnInit(): void {
    this.userService.idUsuarioActual.subscribe((idUsuario) => {
      if (idUsuario !== null) this.idUsuarioActual = idUsuario;
    });
    //console.log(this.idUsuarioActual);
    // this.comentarioService.getComentarios().subscribe({
    //   // next: (comentarios) => {
    //   //   // this.comentarios = comentarios;
    //   // },
    // });

    if (this.carrera) {
      this.CargarComentariosPaginadosCarrera();
      this.carreraService.getAllComents(this.carrera.id!).subscribe(
        (cantidadComentarios: Number) => {
          this.cantidadComentarios = cantidadComentarios
        }
      );
    }

    if (this.Universidad) {
      this.CargarComentariosPaginadosUniversidad();
      this.universidadService.getAllComents(this.Universidad.id!).subscribe(
        (cantidadComentarios: Number) => {
          this.cantidadComentarios = cantidadComentarios
        }
      );
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
    this.comentarioService
      .editComentario(comentarioAguardar)
      .subscribe((comentario: ComentarioDTO) => { });
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
    comentario.mostrarFormularioRespuesta =
      !comentario.mostrarFormularioRespuesta;
  }

  //metodo para mostrar campo de texto para editar el comentario
  public editarComentario(comentario: ComentarioDTO) {
    this.rellenarCampoEdicionComentario(comentario.mensaje!);
    comentario.mostrarFormularioEdicion = !comentario.mostrarFormularioEdicion;
  }

  //metodo que coloca el mensaje del comentario a editar en el campo de texo
  public rellenarCampoEdicionComentario(texto: string) {
    this.edicionComentario = texto;
  }

  //metodo envio del comentario a editar al back
  public enviarComentarioEditado(comentario: ComentarioDTO) {
    comentario.mensaje = this.edicionComentario;
    comentario.editado = true;
    this.comentarioService
      .editComentario(comentario)
      .subscribe((comentario: ComentarioDTO) => {
        console.log(comentario);
      });
    comentario.mostrarFormularioEdicion = !comentario.mostrarFormularioEdicion;
  }

  editarRespuesta(respuesta: RespuestaDTO) {
    this.rellenarCampoEdicionRespuesta(respuesta.mensaje!);
    respuesta.mostrarFormularioEdicion = !respuesta.mostrarFormularioEdicion;
  }

  rellenarCampoEdicionRespuesta(contenidoRespuesta: string) {
    this.edicionRespuesta = contenidoRespuesta;
  }

  //metodo envio del comentario a editar al back
  public enviarRespuestaEditada(respuesta: RespuestaDTO) {
    respuesta.mensaje = this.edicionRespuesta;
    respuesta.editado = true;
    this.respuestaService
      .actualizarRespuesta(respuesta)
      .subscribe((respuesta: RespuestaDTO) => {

      });
    respuesta.mostrarFormularioEdicion = !respuesta.mostrarFormularioEdicion;
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
        console.log(respuesta)
        comentario.listaRespuesta?.push(respuesta);
        this.actualizarComentario(comentario);
      }
    );

    this.respuestaDesdeElInput = '';
    comentario.mostrarFormularioRespuesta = false;
    comentario.mostrarRespuestas = !comentario.mostrarRespuestas;
  }

  //Metodo para crear una nueva instancia de una Respuesta
  crearRespuesta(mensaje: string): Observable<RespuestaDTO> {
    // const usuario: Usuario = {
    //   id: Number(localStorage.getItem('userID'))
    // };

    const usuario: UsuarioDTO = {
      id: this.idUsuarioActual!,
    };

    let nuevaRespuesta: RespuestaDTO = {
      mensaje: mensaje,
      fecha: new Date().toISOString(),
      usuarioId: Number(localStorage.getItem('userID')),
    };
    return this.respuestaService.guardarRespuesta(
      nuevaRespuesta,
      this.idUsuarioActual!
    );
  }

  traerComentariosMasRecientes() {
    // Asegúrate de que listaComentarios no esté vacío
    if (!this.listaComentarios.length) return;

    // Filtrar comentarios con fechas válidas
    const comentariosConFechasValidas = this.listaComentarios.filter(
      (comment) => comment.fecha !== undefined && comment.fecha !== null
    );

    // Ordenar la lista de comentarios por fecha de manera descendente
    comentariosConFechasValidas.sort((a, b) => {
      const fechaA = new Date(a.fecha!);
      const fechaB = new Date(b.fecha!);

      return fechaB.getTime() - fechaA.getTime();
    });

    // reemplazar la lista original con la ordenada
    this.listaComentarios = comentariosConFechasValidas;
  }

  // Método para ordenar la lista de comentarios de más antiguos a más recientes
  traerComentariosMasAntiguos() {
    // Asegúrate de que listaComentarios no esté vacío
    if (!this.listaComentarios.length) return;

    // Filtrar comentarios con fechas válidas
    const comentariosConFechasValidas = this.listaComentarios.filter(
      (comment) => comment.fecha !== undefined && comment.fecha !== null
    );

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
          this.cargarImagenUsuarioComentario(listaComentarios);
        },
        (error) => console.error(error)
      );

    this.desplazarVista();
  }

  cargarImagenUsuarioComentario(listaComentario: ComentarioDTO[]) {
    listaComentario.forEach((comentario) => {
      this.buscarImagenUsuario(comentario.usuarioId!).then(
        (url) => {
          comentario.imagenUsuario = url;
        },
        (error) => {
          console.error('Error al buscar imagen:', error);
        }
      );
    })
  }

  //Metodo para cargar comentarios paginados
  CargarComentariosPaginadosCarrera() {
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
  reaccionar(
    elemento: { listaReaccion?: ReaccionDTO[]; usuarioId?: number },
    like: boolean,
    comentario: boolean
  ) {
    const idUsuarioActual = Number(localStorage.getItem('userID'));
    const listaReaccion: ReaccionDTO[] = elemento.listaReaccion!;
    const reaccionEncontrada = listaReaccion.find(
      (reaccion) => reaccion.usuarioId === idUsuarioActual
    );

    if (reaccionEncontrada) {
      if (like) {
        reaccionEncontrada.noMegusta = 0;
        if (reaccionEncontrada.meGusta === 1) {
          reaccionEncontrada.meGusta = 0;
        } else {
          reaccionEncontrada.meGusta = 1;
        }
      } else {
        reaccionEncontrada.meGusta = 0;
        if (reaccionEncontrada.noMegusta === 1) {
          reaccionEncontrada.noMegusta = 0;
        } else {
          reaccionEncontrada.noMegusta = 1;
        }
      }

      this.reaccionService.editarReaccion(reaccionEncontrada).subscribe({
        error: (err) => console.error('Error al editar la reacción:', err),
      });
    } else {
      const nuevaReaccion = like
        ? this.crearReaccion(1)
        : this.crearReaccion(0);
      this.reaccionService.guardarReaccion(nuevaReaccion).subscribe({
        next: (reaccion: ReaccionDTO) => {
          elemento.listaReaccion?.push(reaccion);
          if (comentario) this.actualizarComentario(elemento);
          else this.respuestaService.actualizarRespuesta(elemento).subscribe();
        },
        error: (err) => console.error('Error al guardar la reacción:', err),
      });
    }
  }

  meGustaComentario(comentario: ComentarioDTO) {
    this.reaccionar(comentario, true, true);
  }

  noMegustaComentario(comentario: ComentarioDTO) {
    this.reaccionar(comentario, false, true);
  }

  megustaRespuesta(respuesta: RespuestaDTO) {
    if (respuesta.listaReaccion == null)
      respuesta.listaReaccion = [];
    this.reaccionar(respuesta, true, false);
  }

  noMeGustaRespuesta(respuesta: RespuestaDTO) {
    this.reaccionar(respuesta, false, false);
  }

  //Metodo para crear una  instancia de una reaccion
  crearReaccion(megustaNoMeGusta: number): ReaccionDTO {
    let reaccion: ReaccionDTO = {}; // Inicializa como un objeto vacío
    if (megustaNoMeGusta === 1) reaccion.meGusta = 1;
    if (megustaNoMeGusta === 0) reaccion.noMegusta = 1;
    reaccion.usuarioId = Number(localStorage.getItem('userID'));
    return reaccion;
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
      .guardarComentario(comentarioAGuardar)
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
      usuarioId: Number(localStorage.getItem('userID')),
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


  // buscarImagenUsuario(idUsuario: number): string {
  //   this.userService.buscarImagenUsuario(idUsuario).subscribe(
  //     (imagen: ImagenUsuario) => {
  //       return imagen.url
  //     }, (error) => {
  //       console.error(error);
  //     }
  //   )
  // }

  buscarImagenUsuario(idUsuario: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.userService.buscarImagenUsuario(idUsuario).subscribe(
        (imagen: ImagenUsuario) => {
          resolve(imagen.url);
        },
        (error) => {
          console.error(error);
          reject(error); // Manejar errores
        }
      )
    })
  }

}
