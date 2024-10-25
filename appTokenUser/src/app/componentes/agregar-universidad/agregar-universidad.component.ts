import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CalificacionDTO } from 'src/app/modelo/calificacion';
import { CarreraDTO } from 'src/app/modelo/CarreraDTO';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';


import { CarreraService } from 'src/app/servicios/carrera.service';
import { UniversidadService } from 'src/app/servicios/universidad.service';
// import { AlertasService } from 'src/app/servicios/alertas.service';

@Component({
  selector: 'app-agregar-universidad',
  templateUrl: './agregar-universidad.component.html',
  styleUrls: ['./agregar-universidad.component.css']
})
export class AgregarUniversidadComponent implements OnInit {
  constructor(private fb: FormBuilder, private router: Router, private carreraService: CarreraService,
    private universidadService: UniversidadService) { }

  ngOnInit(): void {
    this.formularioAltaUniversidad = this.iniciarFormAltaUniversidad();
  }

  formularioAltaUniversidad!: FormGroup;

  indice: number = 1;
  visualizarCamposCarrera: boolean = false;
  imagenCargada: boolean = false;
  listaCarrerasUniversidad: CarreraDTO[] = [];
  listaCalificacionUniversidad: CalificacionDTO[] = [];

  imagenPorDefecto: string = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnrtrI3kER6PYUADR5tjXQtwVvqj4kjiDZgRUf1SFWNQ&s";

  iniciarFormAltaUniversidad(): FormGroup {
    return this.fb.group({
      nombre: ["", [Validators.required, Validators.minLength(4)]],
      direccionWeb: ["", [Validators.required, Validators.pattern("^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[ 0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+ &%\$#_]*)?$")]],
      direccionFisica: ["", [Validators.required, Validators.minLength(10)]],
      descripcion: ["", [Validators.required, Validators.minLength(30)]],
      imagen: ["", [Validators.required]],
      nombreCarrera: [""],
      gradoCarrera: [""],
      duracionCarrera: [""]
    });
  }

  siguiente() {
    this.indice++;
  }

  anterior() {
    this.indice--;
  }

  guardarCalificacion(calificacion: CalificacionDTO) {
    this.listaCalificacionUniversidad.push(calificacion);
  }

  enviarFormulario(event: Event) {

    event.preventDefault();
   
    const universidad: UniversidadDTO = {
      nombre: this.formularioAltaUniversidad.get('nombre')?.value,
      direccionWeb: this.formularioAltaUniversidad.get('direccionWeb')?.value,
      direccion: this.formularioAltaUniversidad.get('direccionFisica')?.value,
      descripcion: this.formularioAltaUniversidad.get('descripcion')?.value,
      imagen: this.imagenPorDefecto,
      listaCarreras: this.listaCarrerasUniversidad,
      listaCalificacion: this.listaCalificacionUniversidad
    };

    this.universidadService.crearUniversidad(universidad).subscribe(() => {
      console.log(universidad)
     // this.router.navigate([""]);
      //this.alertas.alertaTrabajoRealizado();
    }, (error) => {
     // this.alertas.alertaError();
      console.error(error);
    });
  }

  // mostrarCamposAgregarCarrera() {
  //   this.visualizarCamposCarrera = !this.visualizarCamposCarrera;
  // }

  agregarCarreras() {
    const carrera: CarreraDTO = {
    
      nombre: this.formularioAltaUniversidad.get('nombreCarrera')?.value,
      grado: this.formularioAltaUniversidad.get('gradoCarrera')?.value,
      duracion: this.formularioAltaUniversidad.get('duracionCarrera')?.value
    };

    this.carreraService.crearCarrera(carrera).subscribe((carreraCreada) => {
      this.listaCarrerasUniversidad.push(carreraCreada);
    });

    this.formularioAltaUniversidad.patchValue({
      nombreCarrera: '',
      gradoCarrera: '',
      duracionCarrera: ''
    });
  }

  changeImagen(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.imagenPorDefecto = inputValue;
  }

  manejadorErrorImagenUniversdiad() {
    this.imagenCargada = true;
  }

  manejadorExitoImagenUniversdiad() {
    this.imagenCargada = false;
  }
}
