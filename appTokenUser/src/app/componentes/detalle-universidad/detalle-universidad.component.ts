import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalificacionDTO } from 'src/app/modelo/calificacion';
import { CarreraDTO } from 'src/app/modelo/CarreraDTO';
import { ComentarioDTO } from 'src/app/modelo/ComentarioDTO';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';
import { UsuarioDTO } from 'src/app/modelo/UsuarioDTO';
import { CarreraService } from 'src/app/servicios/carrera.service';
import { ComentarioService } from 'src/app/servicios/comentario.service';
import { UniversidadService } from 'src/app/servicios/universidad.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-detalle-universidad',
  templateUrl: './detalle-universidad.component.html',
  styleUrls: ['./detalle-universidad.component.css']
})
export class DetalleUniversidadComponent implements OnInit {


  mostrarCarreraComponent: boolean = false;
  nuevoComentario: string = "";
  universidad!: UniversidadDTO;
  //listaDeRespuestas: Respuesta[] = [];
  idUniversidad: number = 0;
  listaCarreras: CarreraDTO[] = [];
  carreraDeCarreraComponent!: CarreraDTO;
  listaComentarios?: ComentarioDTO[] = [];
  recargaComponenteComentario: boolean = true;
  idUsuarioActual: number | undefined;


  constructor(
    private uniService: UniversidadService,
    private route: ActivatedRoute,
    private comentarioService: ComentarioService,
    // private respuestaService: RespuestaService, 
    private router: Router,
    private carreraService: CarreraService,
    private userService: UsuarioService
    //private alertas: AlertasService
  ) { }

  calificacionEsEditable:boolean = false;
  idCalificacionEditar: number = 0;
  idUsuarioCalificacion: number = 0;


  ngOnInit(): void {
    this.idUniversidad = this.route.snapshot.params["id"];
    this.cargarDatos(this.idUniversidad);

    this.userService.idUsuarioActual.subscribe(idUsuario => {
      if (idUsuario !== null)
        this.idUsuarioActual = idUsuario;
    });

    this.route.queryParams.subscribe(params => {
      this.mostrarCarreraComponent = params['activo'] === 'true'; 
    });
  }

  cargarDatos(id: number): void {
    this.buscarUniversidad(this.idUniversidad);
  
  }

  buscarUniversidad(id: number): void {
    this.uniService.getUniversidadById(id).subscribe(
      (universidad: UniversidadDTO) => {
        this.universidad = universidad;
        this.filtrarCarrerasActivas();
        this.listaComentarios = universidad.listaComentarios;
        //if(universidad.listaCalificacion)
          this.calificacionEditable(universidad.listaCalificacion!);
      },
      (error: any) => {
        console.error('Error al obtener la universidad:', error);
      }
    );
  }

  filtrarCarrerasActivas(): void {
    if (this.universidad.listaCarreras) {
      this.listaCarreras = this.universidad.listaCarreras.filter(carrera => carrera.activa);
    }
  }

  handleCalificacionGuardada(calificacion: CalificacionDTO): void {
    if (this.universidad.listaCalificacion) {
      this.universidad.listaCalificacion.push(calificacion);
      this.uniService.editUniversidad(this.universidad).subscribe(
        (universidad: UniversidadDTO) => {

        },
        (error: any) => {
          console.error('Error al actualizar la universidad:', error);
        }
      );
    }
  }


  crearNuevoComentario(mensaje: string): void {
    const nuevoComentario = this.crearComentario(mensaje);
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
        this.universidad.listaComentarios?.push(comentarioGuardado);
        this.actualizarUniversidad();
      }
    );
  }

  private actualizarUniversidad(): void {
    this.recargaComponenteComentario = false;
    this.uniService.editUniversidad(this.universidad).subscribe(
      (universidadActualizada: UniversidadDTO) => {
        this.universidad = universidadActualizada;
        this.recargaComponenteComentario = true;
        // this.alertas.alertaExito("Comentario guardado");
      }
    );
  }


  eliminarUniversidad(idUniversidad: number): void {
    //this.alertas.alertaEliminacionUniversidad(idUniversidad);
  }

  mostrarDatosCarrera(event: any): void {
    const id = event.target.value;
    if (id) {
      this.mostrarCarreraComponent = false;
      this.carreraService.getCarreraByID(id).subscribe(
        (carrera: CarreraDTO) => {
          this.carreraDeCarreraComponent = carrera;

          this.mostrarCarreraComponent = true;
        }
      );
    }
  }

  // calificacionEditable(listaCalificaciones: CalificacionDTO[]) {
  //   const idUsuario: Number = Number(localStorage.getItem('userID'));
  //   listaCalificaciones.forEach((calificacion: CalificacionDTO) => {
  //     if(calificacion.usuarioId == idUsuario){
  //       this.calificacionEsEditable = true;
  //       this.idUsuarioCalificacion = Number(idUsuario);
  //       this.idCalificacionEditar = calificacion.id!;
  //     }
  // });
  //   //this.calificacionEsEditable = listaCalificaciones.some((calificacion) => calificacion.usuarioId === idUsuario);
  // }
  

  calificacionEditable(listaCalificaciones: CalificacionDTO[]): void {
    const idUsuario = Number(localStorage.getItem('userID'));
    const calificacionEncontrada = listaCalificaciones.find(calificacion => calificacion.usuarioId === idUsuario);

    if (calificacionEncontrada) {
        this.calificacionEsEditable = true;
        this.idUsuarioCalificacion = idUsuario;
        this.idCalificacionEditar = calificacionEncontrada.id!;
    } else {
        this.calificacionEsEditable = false; 
    }
}

}
