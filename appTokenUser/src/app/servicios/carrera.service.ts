import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Carrera } from '../modelo/carrera';
import { Rutas } from '../enumerables/rutas';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  constructor(private http:HttpClient) { }
  private rutaBase = Rutas.RUTA_BASE;
  private rutaEndPoint = "/carrera"

  getCarreras():Observable<Carrera[]>{
    return this.http.get<Carrera[]>(this.rutaBase + this.rutaEndPoint)
  }

  getCarreraByID(id:number):Observable<Carrera>{
    return this.http.get<Carrera>(this.rutaBase + this.rutaEndPoint + "/" + id);
  }

  crearCarrera(carrera:Carrera):Observable<Carrera>{
    return this.http.post<Carrera>(this.rutaBase + this.rutaEndPoint, carrera);
  }

  editCarrera(carrera:Carrera):Observable<Carrera>{
    return this.http.put<Carrera>(this.rutaBase + this.rutaEndPoint, carrera);
  }

}
