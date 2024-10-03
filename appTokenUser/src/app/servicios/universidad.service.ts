import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { Observable } from 'rxjs';
import { Universidad } from '../modelo/universidad';

@Injectable({
  providedIn: 'root'
})
export class UniversidadService {

  constructor(private http:HttpClient) { }

  private baseUrl = Rutas.RUTA_BASE;
  private rutaEndPoint = "/universidad"

  public getUniversidades():Observable<Universidad[]>{
    return this.http.get<Universidad[]>(this.baseUrl + this.rutaEndPoint);
  }

  public getUniversidadById(id:number):Observable<Universidad>{
    return this.http.get<Universidad>(this.baseUrl + this.rutaEndPoint + "/" + id);
  }

  public crearUniversidad(universidad:Universidad):Observable<Universidad>{
    return this.http.post(this.baseUrl + this.rutaEndPoint, universidad);
  }

  public editUniversidad(universidad:Universidad):Observable<Universidad>{
    return this.http.put(this.baseUrl + this.rutaEndPoint, universidad);
  }
}
