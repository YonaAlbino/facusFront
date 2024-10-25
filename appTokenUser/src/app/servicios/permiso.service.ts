import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { Observable } from 'rxjs';

import { EnumsDTOs } from '../enums/enums-dtos';
import { PermisoDTO } from '../modelo/PermisoDTO';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {
  constructor(private http: HttpClient) { }
  private baseUrl = Rutas.RUTA_BASE;
  private rutaEndPoint = "/permiso";

  getPermisos(): Observable<PermisoDTO[]> {
    return this.http.get<PermisoDTO[]>(this.baseUrl + this.rutaEndPoint);
  }

  getPermisoById(id:number): Observable<PermisoDTO> {
    return this.http.get<PermisoDTO>(this.baseUrl + this.rutaEndPoint + "/" + id);
  }
  
  editPermiso(permiso:PermisoDTO):Observable<PermisoDTO>{
    const permisoClass = {
      ...permiso,  
      '@class': EnumsDTOs.PermisoDTO  
    };
    return this.http.put(this.baseUrl + this.rutaEndPoint, permisoClass);
  }

  crearPermiso(permiso:PermisoDTO):Observable<PermisoDTO>{
    const permisoClass = {
      ...permiso,  
      '@class': EnumsDTOs.PermisoDTO  
    };
    return this.http.post(this.baseUrl + this.rutaEndPoint, permisoClass);
  }
}
