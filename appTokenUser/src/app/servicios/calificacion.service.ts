import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { Observable } from 'rxjs';
import { Calificacion } from '../modelo/calificacion';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {

  constructor(private http:HttpClient) { }
  private baseUrl = Rutas.RUTA_BASE;
  private rutaEndPoint = "/calificacion";

  getCalificaciones():Observable<Calificacion[]>{
    return this.http.get<Calificacion[]>(this.baseUrl + this.rutaEndPoint);
  }

  getCalificacionById(id:number):Observable<Calificacion>{
    return this.http.get<Calificacion>(this.baseUrl + this.rutaEndPoint + "/" + id);
  }
  
  crearCalificacion(calificacion:Calificacion):Observable<Calificacion>{
    return this.http.post<Calificacion>(this.baseUrl + this.rutaEndPoint, calificacion);
  }
  
  editCalificacion(calificacion:Calificacion):Observable<Calificacion>{
    return this.http.put<Calificacion>(this.baseUrl + this.rutaEndPoint, calificacion);
  }
  

}
