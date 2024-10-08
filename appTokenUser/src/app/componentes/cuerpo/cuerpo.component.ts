import { Component, OnInit } from '@angular/core';
import { Universidad } from 'src/app/modelo/universidad';
import { UniversidadService } from 'src/app/servicios/universidad.service';
import { catchError, EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-cuerpo',
  templateUrl: './cuerpo.component.html',
  styleUrls: ['./cuerpo.component.css']
})
export class CuerpoComponent implements OnInit {

  universidades: Universidad[] = [];
  registrosPorPagina = 8;
  paginaActual = 0;
  cantidadPaginas = 0;
  universidadBuscada = false;
  recarga = false;
  mensajeError!:string;

  constructor(private universidadService: UniversidadService) { }

  ngOnInit() {
    this.cargarUniversidades();
  }

  cargarUniversidades() {
    this.universidadService.getUniversidades().subscribe(data => {
      this.cantidadPaginas = Math.ceil(data.length / this.registrosPorPagina);
      this.obtenerUniversidadesPaginadas();
    }, error => {
      console.log(error);
    });
  }

  obtenerUniversidadesPaginadas() {
    this.universidadService.obtenerUniversidadesPaginadas(this.paginaActual, this.registrosPorPagina)
      .subscribe({
        next: (universidades) => {
          this.universidades = universidades;
        }
      });
  }
  
  cambiarPagina(pagina: number) {
    if (pagina < 0 || pagina >= this.cantidadPaginas) {
      return; // Evitar paginaciones fuera de rango
    }
    this.paginaActual = pagina;
    this.obtenerUniversidadesPaginadas();
  }

  manejadorUniversdiadEncontrada(universidades: Universidad[]) {
    if (universidades.length > 0) {
      this.universidades = universidades;
      this.universidadBuscada = false;
      return;
    }
    this.mostrarAlertaUniNoEncontrada();
    this.obtenerUniversidadesPaginadas();
  }

  mostrarAlertaUniNoEncontrada() {
    this.universidadBuscada = true;
    setTimeout(() => {
      this.universidadBuscada = false;
    }, 3000);
  }

  recargar() {
    this.recarga = true;
    this.obtenerUniversidadesPaginadas();
    this.recarga = false;
  }
}
