import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarreraDTO } from 'src/app/modelo/CarreraDTO';
import { ComentarioDTO } from 'src/app/modelo/ComentarioDTO';
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
  styleUrls: ['./detalles-notificacion.component.css']
})
export class DetallesNotificacionComponent implements OnInit {
  id: number | null = null;
  carrera: boolean | undefined;
  comentario: boolean | undefined;
  usuario: boolean | undefined;
  universidad: boolean | undefined;
  permiso: boolean | undefined;
  respuesta: boolean | undefined;
  usuarioPropietario:UsuarioDTO | undefined;

  carreraBuscada: CarreraDTO | undefined;
  cometarioBuscado: ComentarioDTO | undefined;
  usuarioBuscado: UsuarioDTO | undefined;
  universidadBuscada: UniversidadDTO | undefined;
  permisoBuscado: PermisoDTO | undefined;
  respuestaBuscada: RespuestaDTO | undefined;


  constructor(private activatedRoute: ActivatedRoute,
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
    this.cargarDatosEntidad(this.carrera!, this.comentario!, this.permiso!, this.usuario!, this.universidad!, this.respuesta!);
  }

  cargarDatosEntidad(carrera: boolean, comentario: boolean, permiso: boolean, usuario: boolean, universidad: boolean, respuesta: boolean) {
    if (comentario)
      this.cargarComentario();
    if (carrera)
      this.cargarCarrera();
    if (permiso)
      this.cargarPermiso();
    if (usuario)
      this.cargarUsuario();
    if (universidad)
      this.cargarUniversidad();
    if (respuesta)
      this.cargarRespuesta();
  }
  cargarRespuesta() {
    this.respuestaService.findRespuestaById(this.id!).subscribe
      (
        (respuesta: RespuestaDTO) => {
          this.respuestaBuscada = respuesta
        }
      )
  }

  cargarUniversidad() {
    this.universidadService.getUniversidadById(this.id!).subscribe(
      (universidad: UniversidadDTO) => {
        this.universidadBuscada = universidad;
        this.usuarioService.getUsuarioById(universidad.usuarioId!).subscribe(
          (usuario:UsuarioDTO) => {
            this.usuarioPropietario = usuario;
          }
        )
      }
    )
  }
  cargarUsuario() {
    this.usuarioService.getUsuarioById(this.id!).subscribe(
      (usuario: UsuarioDTO) => {
        this.usuarioBuscado = usuario;
      }
    )
  }

  cargarPermiso() {
    this.permisoService.getPermisoById(this.id!).subscribe(
      (permiso: PermisoDTO) => {
        this.permisoBuscado = permiso;
      }
    )
  }

  cargarCarrera() {
    this.carreraService.getCarreraByID(this.id!).subscribe(
      (carrera: CarreraDTO) => {
        this.carreraBuscada = carrera;
        this.universidadService.getUniversidadById(carrera.universidadId!).subscribe(
          (universdiad:UniversidadDTO) => {
            this.usuarioService.getUsuarioById(universdiad.usuarioId!).subscribe(
              (usuario:UsuarioDTO) => {
                this.usuarioPropietario = usuario;
              }
            )
          }
        )
      }
    )
  }

  cargarComentario() {
    this.comentarioService.getComentarioById(this.id!).subscribe(
      (comentario: ComentarioDTO) => {
        this.cometarioBuscado = comentario;
      }
    )
  }
}
