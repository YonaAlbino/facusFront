import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor() { }

  mostrarAlerta(titulo:string){
    Swal.fire({
      title: titulo,
      icon: "success",
      draggable: true
    });
  }
}
