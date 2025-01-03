import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { CarreraDTO } from '../modelo/CarreraDTO';
import { CarreraService } from './carrera.service';
import { UniversidadService } from './universidad.service';
import { UniversidadDTO } from '../modelo/UniversidadDTO';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor(private carreraService: CarreraService, private univiersidadService: UniversidadService) { }

  mostrarAlerta(titulo: string) {
    Swal.fire({
      title: titulo,
      icon: "success",
      draggable: true
    });
  }

  // async modalAgregarCarrera(): Promise<void> {
  //   const { value: formValues } = await Swal.fire({
  //     title: "Agregar carrera",
  //     html: `
  //     <style>
  //       .swal2-input {
  //         width: 100%;
  //         padding: 10px;
  //         margin: 10px 0;
  //         box-sizing: border-box;
  //         border: 1px solid #ccc;
  //         border-radius: 4px;
  //       }
  //       label {
  //         display: block;
  //         font-weight: bold;
  //         margin-bottom: 5px;
  //       }
  //     </style>
  //     <label for="swal-input1">Nombre de la carrera:</label>
  //     <input id="swal-input1" class="swal2-input" placeholder="Ejemplo: Ingeniería en Sistemas">
  //     <label for="swal-input2">Grado de la carrera:</label>
  //     <input id="swal-input2" class="swal2-input" placeholder="Ejemplo: Superior">
  //     <label for="swal-input2">Duración de la carrera:</label>
  //     <input id="swal-input2" class="swal2-input" placeholder="Ejemplo: 5 años">
  //   `,
  //     focusConfirm: false,
  //     preConfirm: () => {
  //       const input1 = (document.getElementById("swal-input1") as HTMLInputElement).value;
  //       const input2 = (document.getElementById("swal-input2") as HTMLInputElement).value;
  //       return [input1, input2];
  //     }
  //   });

  //   if (formValues) {
  //     Swal.fire(JSON.stringify(formValues));
  //   }
  // }


  async modalAgregarCarrera(iduniversidad: number): Promise<Observable<UniversidadDTO>> {
    const { value: carrera } = await Swal.fire({
      title: "Agregar carrera",
      html: this.getCarreraFormHtml(),
      focusConfirm: false,
      preConfirm: () => this.createCarreraDTO(iduniversidad),
    });

    if (!carrera) {
      return new Observable<UniversidadDTO>();  // Retornar observable vacío si no se agregó la carrera
    }

    return this.carreraService.crearCarrera(carrera).pipe(
      switchMap(carreraGuardada => {
        return this.univiersidadService.getUniversidadById(iduniversidad).pipe(
          switchMap(universidad => {
            // Aquí se define y usa correctamente 'carreraGuardada'
            universidad.listaCarreras?.push(carreraGuardada);
            return this.univiersidadService.editUniversidad(universidad);
          })
        );
      })
    );
  }

  private getCarreraFormHtml(): string {
    return `
      <style>
        .swal2-input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          box-sizing: border-box;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
        }
      </style>
      <label for="swal-input1">Nombre de la carrera:</label>
      <input id="swal-input1" class="swal2-input" placeholder="Ejemplo: Ingeniería en Sistemas">
      <label for="swal-input2">Grado de la carrera:</label>
      <input id="swal-input2" class="swal2-input" placeholder="Ejemplo: Superior">
      <label for="swal-input3">Duración de la carrera:</label>
      <input id="swal-input3" class="swal2-input" placeholder="Ejemplo: 5 años">
    `;
  }

  private createCarreraDTO(iduniversidad: number): CarreraDTO | null {
    const nombre = (document.getElementById("swal-input1") as HTMLInputElement).value;
    const grado = (document.getElementById("swal-input2") as HTMLInputElement).value;
    const duracion = (document.getElementById("swal-input3") as HTMLInputElement).value;

    // Validación: Si alguno de los campos está vacío, mostrar un mensaje de error
    if (!nombre || !grado || !duracion) {
      Swal.showValidationMessage('Todos los campos son obligatorios');
      return null; // Retorna null para evitar la creación de la carrera
    }

    return {
      nombre,
      grado,
      duracion,
      activa: true,
      universidadId: iduniversidad
    };
  }



}
