import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { UniversidadService } from 'src/app/servicios/universidad.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregacion-carrera',
  templateUrl: './agregacion-carrera.component.html',
  styleUrls: ['./agregacion-carrera.component.css']
})
export class AgregacionCarreraComponent implements OnInit {

  idUniversidad: number = 0;
  universidadAeditar: UniversidadDTO | undefined;

  constructor(private route: ActivatedRoute, private universidadService: UniversidadService, private alertas:AlertasService) { }

  ngOnInit(): void {
    this.idUniversidad = this.route.snapshot.params["id"];
    this.buscarUniversidad();
  }

  buscarUniversidad() {
    this.universidadService.getUniversidadById(this.idUniversidad).subscribe(
      (universidad: UniversidadDTO) => {
        this.universidadAeditar = universidad;
      }, (error) => {
        console.error(error);
      }
    )
  }

  async agregarCarrera() {
    (await this.alertas.modalAgregarCarrera(this.idUniversidad)).subscribe(
      (universidadActualizada: UniversidadDTO) => {
        this.universidadAeditar = universidadActualizada;
        Swal.fire('Carrera agregada');
      },
      (error) => {
        console.error('Error al agregar carrera:', error);
      }
    );
  }

  
}
