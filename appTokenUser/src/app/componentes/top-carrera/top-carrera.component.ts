import { Component, OnInit } from '@angular/core';
import { Carrera } from 'src/app/modelo/carrera';
import { Universidad } from 'src/app/modelo/universidad';
import { CarreraService } from 'src/app/servicios/carrera.service';
import { UniversidadService } from 'src/app/servicios/universidad.service';

@Component({
  selector: 'app-top-carrera',
  templateUrl: './top-carrera.component.html',
  styleUrls: ['./top-carrera.component.css']
})
export class TopCarreraComponent implements OnInit{


  listaTopCarreras: Carrera[] = []; // Almacena la lista de carreras
  universidad: Universidad | null = null; // Almacena la universidad seleccionada
  indiceCarreraSeleccionada: number | null = null; // Índice de la carrera seleccionada
  paginaActual: number = 0; // Página actual para la paginación
  registrosPorPagina: number = 5; // Número de registros por página
  totalCarrerasCargadas: number = 0; // Lleva la cuenta total de las carreras cargadas

  constructor(
    private carreraService: CarreraService,
    private universidadService: UniversidadService
  ) { }

  ngOnInit(): void {
    this.cargarCarreras(); // Cargar las carreras al iniciar el componente
  }

  // Método para cargar carreras basado en la página actual y el número de registros por página
  cargarCarreras(): void {
    this.carreraService.obtenerTopCarreras(this.paginaActual, this.registrosPorPagina)
      .subscribe(
        (carreras: Carrera[]) => {
          this.listaTopCarreras = carreras;
        },
        (error) => {
          console.error('Error al cargar las carreras:', error);
        }
      );
  }

  // Cargar más carreras (incrementa la página actual)
  cargarMasCarreras(cantidadCarreras: number): void {
    this.paginaActual++;
    this.cargarCarreras();
    this.totalCarrerasCargadas += cantidadCarreras;
  }

  // Cargar menos carreras (decrementa la página actual)
  cargarMenosCarreras(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.cargarCarreras();
      this.totalCarrerasCargadas -= this.registrosPorPagina;
    }
  }

  // Buscar la universidad asociada a una carrera y mostrarla
  buscarUniversidadPorIdCarrera(carrera: Carrera, indice: number): void {
    this.indiceCarreraSeleccionada = indice;

    this.universidadService.getuniversidadIdCarrera(carrera.id!)
      .subscribe(
        (universidad: Universidad) => {
          this.universidad = universidad;
          console.log(universidad)
        },
        (error) => {
          console.error('Error al buscar la universidad:', error);
        }
      );
  }

}
