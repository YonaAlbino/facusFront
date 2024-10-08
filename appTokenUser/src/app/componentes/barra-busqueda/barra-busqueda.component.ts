import { Component, EventEmitter, Output } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { Universidad } from 'src/app/modelo/universidad';
import { UniversidadService } from 'src/app/servicios/universidad.service';

@Component({
  selector: 'app-barra-busqueda',
  templateUrl: './barra-busqueda.component.html',
  styleUrls: ['./barra-busqueda.component.css']
})
export class BarraBusquedaComponent {

  constructor(private universidadService: UniversidadService) { }
  mensajeError!: string;
  nombreUniversidad!: string;

  @Output() universdiadEncontrada: EventEmitter<Universidad[]> = new EventEmitter<Universidad[]>();
  buscarUniversidadesPorNombre(nombreUniversidad: string) {
    this.universidadService.buscarUniversidadesPorNombre(nombreUniversidad)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (universidades) => {
          this.universdiadEncontrada.emit(universidades);
        }
      })
  }
}
