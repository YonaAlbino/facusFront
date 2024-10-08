import { Component } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { Universidad } from 'src/app/modelo/universidad';
import { UniversidadService } from 'src/app/servicios/universidad.service';

@Component({
  selector: 'app-top-universidad',
  templateUrl: './top-universidad.component.html',
  styleUrls: ['./top-universidad.component.css']
})
export class TopUniversidadComponent {

  listaTopUniversidades: Universidad[] = [];
  pagina: number = 0;
  registrosPorPagina = 5;
  totalUniversidades: number = 0; // Para almacenar el total de universidades
  errorMessage: string | null = null; // Para manejar errores

  constructor(private universidadService: UniversidadService) { }
  mensajeError!: string;

  ngOnInit(): void {
    this.cargarUniversidades();
  }

  cargarUniversidades() {
    this.universidadService.obtenerTopUniversidades(this.pagina, this.registrosPorPagina)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (universidades) => {
          this.listaTopUniversidades = universidades;
          this.totalUniversidades = universidades.length;
        }
      })
  }

  cargarMasUniversidades() {
    this.pagina += 1;
    this.cargarUniversidades();
  }

  cargarMenosUniversidades() {
    if (this.pagina > 0) {
      this.pagina -= 1;
      this.cargarUniversidades();
    }
  }

}
