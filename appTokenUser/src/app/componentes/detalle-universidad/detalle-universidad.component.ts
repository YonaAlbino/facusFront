import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalificacionDTO } from 'src/app/modelo/calificacion';
import { CarreraDTO } from 'src/app/modelo/CarreraDTO';
import { ComentarioDTO } from 'src/app/modelo/ComentarioDTO';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';
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
  variableDeEjemplo: boolean = true;
  idUsuarioActual: number | undefined ;


  constructor(
    private uniService: UniversidadService,
    private route: ActivatedRoute,
    private comentarioService: ComentarioService,
    // private respuestaService: RespuestaService, 
    private router: Router,
    private carreraService: CarreraService,
    private userService:UsuarioService
    //private alertas: AlertasService
  ) { }

  ngOnInit(): void {
    this.idUniversidad = this.route.snapshot.params["id"];
    this.cargarDatos(this.idUniversidad);

    this.userService.idUsuarioActual.subscribe(idUsuario => {
      if (idUsuario !== null)
        this.idUsuarioActual = idUsuario;
    });
  }

  cargarDatos(id: number): void {
    this.buscarUniversidad(this.idUniversidad);
  }

  buscarUniversidad(id: number): void {
    this.uniService.getUniversidadById(id).subscribe(
      (universidad: UniversidadDTO) => {
        console.log(universidad.listaCalificacion?.length)
        this.universidad = universidad;
        this.filtrarCarrerasActivas();
        this.listaComentarios = universidad.listaComentarios;
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
          console.log('Universidad actualizada:', universidad);
        },
        (error: any) => {
          console.error('Error al actualizar la universidad:', error);
        }
      );
    }
  }

  // crearNuevoComentario(mensaje: string): void {

  //   const usuario: Usuario = {
  //     id: Number(localStorage.getItem('userID'))
  //   };

  //   const nuevoComentario: Comentario = {
  //     mensaje: mensaje,
  //     usuario:usuario
  //     //listaComentario: []
  //   };

  //   this.comentarioService.guardarComentario(nuevoComentario).subscribe(
  //     (comentario: Comentario) => {
  //       this.universidad.listaComentarios?.push(comentario);
  //       console.log(comentario);
  //       console.log(this.universidad)
  //       this.uniService.editUniversidad(this.universidad).subscribe(
  //         (universidad: Universidad) => {
  //           this.universidad = universidad;
  //           this.variableDeEjemplo = true;
  //           // this.alertas.alertaExito("Comentario guardado");
  //         }
  //       );
  //       this.nuevoComentario = "";
  //     }
  //   );
  // }


  crearNuevoComentario(mensaje: string): void {
    const nuevoComentario = this.crearComentario(mensaje);
    this.guardarComentario(nuevoComentario);
    this.nuevoComentario = "";
}

private crearComentario(mensaje: string): ComentarioDTO {
    // const usuario: Usuario = {
    //     id: Number(localStorage.getItem('userID'))
    // };

    return {
        mensaje: mensaje,
        //usuario: usuario,
        fecha:new Date().toISOString()
        //listaComentario: []
    };
}

private guardarComentario(comentario: ComentarioDTO): void {
    this.comentarioService.guardarComentario(comentario, Number(this.idUsuarioActual)).subscribe(
        (comentarioGuardado: ComentarioDTO) => {
          const comentario:ComentarioDTO = {
            id:comentarioGuardado.id,
            //fecha:new Date().toISOString()
          }
            this.universidad.listaComentarios?.push(comentario);
            this.actualizarUniversidad();
        }
    );
}

private actualizarUniversidad(): void {
    this.uniService.editUniversidad(this.universidad).subscribe(
        (universidadActualizada: UniversidadDTO) => {
            this.universidad = universidadActualizada;
            this.variableDeEjemplo = true;
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
        },
        (error: any) => {
          console.error('Error al buscar la carrera:', error);
        }
      );
    }
  }

}
