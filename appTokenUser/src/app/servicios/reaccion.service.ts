import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { Observable } from 'rxjs';
import { Reaccion } from '../modelo/reaccion';

@Injectable({
  providedIn: 'root'
})
export class ReaccionService {

  constructor(private http:HttpClient) { }
  private rutaBase = Rutas.RUTA_BASE;
  private rutaEndPoint = "/reaccion"

  getReacciones():Observable<Reaccion[]>{
    return this.http.get<Reaccion[]>(this.rutaBase + this.rutaEndPoint);
  }

  getReaccionById(id:number):Observable<Reaccion>{
    return this.http.get<Reaccion>(this.rutaBase + this.rutaEndPoint + "/" + id);
  }

  crearReaccion(reaccion:Reaccion):Observable<Reaccion>{
    return this.http.post(this.rutaBase + this.rutaEndPoint, reaccion);
  }

  editarReaccion(reaccion:Reaccion):Observable<Reaccion>{
    return this.http.put(this.rutaBase + this.rutaEndPoint, reaccion);
  }
}
