import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarreraDTO } from 'src/app/modelo/CarreraDTO';
import { ComentarioDTO, ComentarioDTO as respuestaDTO } from 'src/app/modelo/ComentarioDTO';
import { MensajeRetornoSimple } from 'src/app/modelo/mensaje-retorno-simple';
import { PermisoDTO } from 'src/app/modelo/PermisoDTO';
import { RespuestaDTO } from 'src/app/modelo/RespuestaDTO';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';
import { UsuarioDTO } from 'src/app/modelo/UsuarioDTO';
import { CarreraService } from 'src/app/servicios/carrera.service';
import { ComentarioService } from 'src/app/servicios/comentario.service';
import { PermisoService } from 'src/app/servicios/permiso.service';
import { RespuestaService } from 'src/app/servicios/respuesta.service';
import { UniversidadService } from 'src/app/servicios/universidad.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-detalles-notificacion',
  templateUrl: './detalles-notificacion.component.html',
  styleUrls: ['./detalles-notificacion.component.css'],
})
export class DetallesNotificacionComponent implements OnInit {

  id: number | null = null;
  carrera: boolean | undefined;
  comentario: boolean | undefined;
  usuario: boolean | undefined;
  universidad: boolean | undefined;
  permiso: boolean | undefined;
  respuesta: boolean | undefined;
  usuarioPropietario: UsuarioDTO | undefined;
  respuestaComentarioRecibida: boolean | undefined;
  respuestaAunaRespuesta: boolean | undefined;

  carreraBuscada: CarreraDTO | undefined;
  cometarioBuscado: respuestaDTO | undefined;
  comentarioHilo: respuestaDTO | undefined;
  usuarioBuscado: UsuarioDTO | undefined;
  universidadBuscada: UniversidadDTO | undefined;
  permisoBuscado: PermisoDTO | undefined;
  respuestaBuscada: RespuestaDTO | undefined;
  respuestaComentario: RespuestaDTO | undefined;
  respuestaAotraRespuesta: RespuestaDTO | undefined;
  registroEliminado: boolean = false;;
  infraccion: boolean | undefined;
  cargando: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private universidadService: UniversidadService,
    private comentarioService: ComentarioService,
    private permisoService: PermisoService,
    private carreraService: CarreraService,
    private usuarioService: UsuarioService,
    private respuestaService: RespuestaService
  ) { }

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    const state = history.state;
    this.carrera = state.carrera;
    this.comentario = state.comentario;
    this.usuario = state.usuario;
    this.universidad = state.universidad;
    this.permiso = state.permiso;
    this.respuesta = state.respuesta;
    this.respuestaComentarioRecibida = state.respuestaComentarioRecibida;
    this.respuestaAunaRespuesta = state.respuestaAunaRespuesta;
    this.cargarDatosEntidad(
      this.carrera!,
      this.comentario!,
      this.permiso!,
      this.usuario!,
      this.universidad!,
      this.respuesta!,
      this.respuestaComentarioRecibida!,
      this.respuestaAunaRespuesta!
    );
  }

  cargarDatosEntidad(
    carrera: boolean,
    comentario: boolean,
    permiso: boolean,
    usuario: boolean,
    universidad: boolean,
    respuesta: boolean,
    respuestaComentarioRecibida: boolean,
    respuestaAunaRespuesta: boolean
  ) {
    if (comentario) this.cargarComentario();
    if (carrera) this.cargarCarrera();
    if (permiso) this.cargarPermiso();
    if (usuario) this.cargarUsuario();
    if (universidad) this.cargarUniversidad();
    if (respuesta) this.cargarRespuesta();
    if (respuestaComentarioRecibida) this.cargarDatosRespuestaComentario();
    if (respuestaAunaRespuesta) this.cargarDatosRespuestaAUnaRespuesta();
  }

  cargarDatosRespuestaAUnaRespuesta() {
    this.respuestaService
      .findRespuestaById(this.id!)
      .subscribe((respuesta: RespuestaDTO) => {
        this.respuestaAotraRespuesta = respuesta;
      }, (error) => {
        this.registroEliminado = true;
        console.error(error)
      }
      );
  }

  cargarDatosRespuestaComentario() {
    this.respuestaService
      .findRespuestaById(this.id!)
      .subscribe((respuesta: RespuestaDTO) => {
        this.respuestaComentario = respuesta;
      }, (error) => {
        this.registroEliminado = true;
        console.error(error)
      }
      );
  }

  cargarRespuesta() {
    this.respuestaService
      .findRespuestaById(this.id!)
      .subscribe((respuesta: RespuestaDTO) => {
        this.respuestaBuscada = respuesta;
      }, (error) => {
        this.registroEliminado = true;
        console.error(error)
      }
      );
  }

  eliminarComentario(id: number | undefined) {
    this.comentarioService
      .getComentarioById(id!)
      .subscribe((comentarioEncontrado: respuestaDTO) => {
        let comentario: respuestaDTO = comentarioEncontrado;
        comentario.mensaje =
          'Este comentario ha sido eliminado por un administrador';
        comentario.eliminado = true;
        this.comentarioService
          .editComentario(comentario)
          .subscribe((comentarioEliminado: respuestaDTO) => {
            window.location.reload();
            console.log(comentarioEliminado);
          });
      });
  }

  eliminarRespuesta(id: number | undefined) {
    this.respuestaService
      .findRespuestaById(id!)
      .subscribe((respuestaEncontrada: RespuestaDTO) => {
        let respuesta: respuestaDTO = respuestaEncontrada;
        respuesta.mensaje =
          'Este comentario ha sido eliminado por un administrador';
        respuesta.eliminado = true;
        this.respuestaService
          .actualizarRespuesta(respuesta)
          .subscribe((respuestaEliminada: respuestaDTO) => {
            window.location.reload();
            console.log(respuestaEliminada);
          });
      });
  }

  cargarUniversidad() {
    this.universidadService.getUniversidadById(this.id!).subscribe(
      (universidad: UniversidadDTO) => {
        this.universidadBuscada = universidad;
        this.usuarioService.getUsuarioById(universidad.usuarioId!).subscribe(
          (usuario: UsuarioDTO) => {
            this.usuarioPropietario = usuario;
          },
          (error) => {
            console.error('Error al cargar el usuario propietario:', error);
          }
        );
      },
      (error) => {
        console.error('Error al cargar la universidad:', error);
        this.registroEliminado = true;
      }
    );
  }

  cargarUsuario() {
    this.usuarioService
      .getUsuarioById(this.id!)
      .subscribe((usuario: UsuarioDTO) => {
        this.usuarioBuscado = usuario;
      }, (error) => {
        this.registroEliminado = true;
        console.error(error)
      }
      );
  }

  cargarPermiso() {
    this.permisoService
      .getPermisoById(this.id!)
      .subscribe((permiso: PermisoDTO) => {
        this.permisoBuscado = permiso;
      }, (error) => {
        this.registroEliminado = true;
        console.error(error)
      }
      );
  }

  cargarCarrera() {
    this.carreraService
      .getCarreraByID(this.id!)
      .subscribe((carrera: CarreraDTO) => {
        this.carreraBuscada = carrera;
        this.universidadService
          .getUniversidadById(carrera.universidadId!)
          .subscribe((universdiad: UniversidadDTO) => {
            this.usuarioService
              .getUsuarioById(universdiad.usuarioId!)
              .subscribe((usuario: UsuarioDTO) => {
                this.usuarioPropietario = usuario;
              });
          }, (error) => {
            this.registroEliminado = true;
            console.error(error)
          }
          );
      }, (error) => {
        this.registroEliminado = true;
        console.error(error)
      }
      );
  }

  cargarComentario() {
    this.comentarioService
      .getComentarioById(this.id!)
      .subscribe((comentario: respuestaDTO) => {
        this.cometarioBuscado = comentario;
        this.usuarioService
          .getUsuarioById(comentario.usuarioId!)
          .subscribe((usuario: UsuarioDTO) => {
            this.usuarioPropietario = usuario;
          });
      }, (error) => {
        this.registroEliminado = true;
        console.error(error)
      }
      );
  }

  eliminarUniversidad(id: number | undefined) {
    this.universidadService
      .eliminarUniversidad(id!)
      .subscribe((mensaje: string) => {
        console.log(mensaje);
        window.location.reload();
      });
  }

  eliminarCarrera(id: number | undefined) {
    this.carreraService.eliminarCarrera(id!).subscribe(
      () => {
        console.log("Carrera eliminada");
        window.location.reload();
      }, (error) => {
        console.error(error);
      }
    )
  }

  infraccionarUsuario(id: number | undefined) {
    this.cargando = true;
    this.usuarioService.infraccionarUsuario(id!).subscribe(
      (mensaje: MensajeRetornoSimple) => {
        console.log(mensaje);
        this.infraccion = true;
        this.cargando = false;
      }, (error) => {
        console.error(error);
      }
    )
  }

  eliminarEinfraccionar(arg0: number | undefined) {
    throw new Error('Method not implemented.');
  }

  verHilo(id: number | undefined) {
    this.respuestaService.findComentariosByListaRespuestaId(id!).subscribe(
      (comentario: ComentarioDTO) => {
        this.comentarioHilo = comentario
      }
    )
  }

  verHiloRespuesta(id: number | undefined){
    console.log(id)
    this.comentarioService.getComentarioById(id!).subscribe(
      (comentario: ComentarioDTO) => {
        this.comentarioHilo = comentario
      }
    )
  }

}
