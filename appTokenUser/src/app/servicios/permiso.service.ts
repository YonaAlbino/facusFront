import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { Observable } from 'rxjs';
import { Permiso } from '../modelo/permiso';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {
  constructor(private http: HttpClient) { }
  private baseUrl = Rutas.RUTA_BASE;
  private rutaEndPoint = "/permiso";

  getPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(this.baseUrl + this.rutaEndPoint);
  }

  getPermisoById(id:number): Observable<Permiso> {
    return this.http.get<Permiso>(this.baseUrl + this.rutaEndPoint + "/" + id);
  }
  
  editPermiso(permiso:Permiso):Observable<Permiso>{
    return this.http.put(this.baseUrl + this.rutaEndPoint, permiso);
  }

  crearPermiso(permiso:Permiso):Observable<Permiso>{
    return this.http.post(this.baseUrl + this.rutaEndPoint, permiso);
  }
}
