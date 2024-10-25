import { Component, EventEmitter, Output } from '@angular/core';
import { CalificacionDTO } from 'src/app/modelo/calificacion';

import { CalificacionService } from 'src/app/servicios/calificacion.service';

@Component({
  selector: 'app-puntuacion',
  templateUrl: './puntuacion.component.html',
  styleUrls: ['./puntuacion.component.css']
})
export class PuntuacionComponent {

  puntuacion: number = 0.0;


  constructor(private calificacionService: CalificacionService) { }

  @Output() calificacionGuardada: EventEmitter<CalificacionDTO> = new EventEmitter<CalificacionDTO>();


  capturarPuntacion(event: Event) {
    console.log("puntiacion!!!")
    let puntos: string = (<HTMLInputElement>event.target).value;
    this.puntuacion = parseFloat(puntos);

    let calificacion: CalificacionDTO = {
      nota: this.puntuacion
    }

    this.calificacionService.crearCalificacion(calificacion).subscribe((calificacion) => {
      this.calificacionGuardada.emit(calificacion);
    });
  }

}
