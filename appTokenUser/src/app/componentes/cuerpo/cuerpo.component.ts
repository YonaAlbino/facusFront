import { Component, OnInit } from '@angular/core';

import { UniversidadService } from 'src/app/servicios/universidad.service';
import { catchError, EMPTY, Observable } from 'rxjs';
import { UtilService } from 'src/app/servicios/util.service';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';

@Component({
  selector: 'app-cuerpo',
  templateUrl: './cuerpo.component.html',
  styleUrls: ['./cuerpo.component.css']
})
export class CuerpoComponent implements OnInit {
  universidades: UniversidadDTO[] = [];
  registrosPorPagina = 8;
  paginaActual = 0;
  cantidadPaginas = 0;
  universidadBuscada = false;
  recarga = false;
  mensajeError!:string;

  constructor(private universidadService: UniversidadService, private util:UtilService) { }

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

  manejadorUniversdiadEncontrada(universidades: UniversidadDTO[]) {
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

  imagenNoCargada(event: Event) {
    const imgElemnt = event.target as HTMLImageElement;
    imgElemnt.src = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";
  }



}
