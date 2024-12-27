import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { Observable } from 'rxjs';

import { EnumsDTOs } from '../enums/enums-dtos';
import { UniversidadDTO } from '../modelo/UniversidadDTO';

@Injectable({
  providedIn: 'root'
})
export class UniversidadService {
  constructor(private http: HttpClient) { }

  private baseUrl = Rutas.RUTA_BASE;
  private rutaEndPoint = "/universidad"

  public getUniversidades(): Observable<UniversidadDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<UniversidadDTO[]>(this.baseUrl + this.rutaEndPoint, {headers});
  }

  public getUniversidadById(id: number): Observable<UniversidadDTO> {
    return this.http.get<UniversidadDTO>(this.baseUrl + this.rutaEndPoint + "/" + id);
  }

  public crearUniversidad(universidad: UniversidadDTO): Observable<UniversidadDTO> {
    const universidadClass = {
      ...universidad,
      '@class': EnumsDTOs.UniversidadDTO
    };
    return this.http.post(this.baseUrl + this.rutaEndPoint, universidadClass);
  }

  public editUniversidad(universidad: UniversidadDTO): Observable<UniversidadDTO> {
    console.log(universidad)
    return this.http.put(this.baseUrl + this.rutaEndPoint, universidad);
  }

  public obtenerTopUniversidades(pagina: number, tamanio: number): Observable<UniversidadDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<UniversidadDTO[]>(`${this.baseUrl}${this.rutaEndPoint}/obtenerTopUniversidades?pagina=${pagina}&tamanio=${tamanio}`, { headers });
  }


  getuniversidadIdCarrera(idCarrera: number): Observable<UniversidadDTO> {
    return this.http.get<UniversidadDTO>(this.baseUrl + this.rutaEndPoint + "/universidadID/" + idCarrera);
  }
  
  obtenerUniversidadesPaginadas(pagina:number, tamanio:number):Observable<UniversidadDTO[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<UniversidadDTO[]>(`${this.baseUrl}${this.rutaEndPoint}/paginadas?pagina=${pagina}&tamanio=${tamanio}`, {headers});
  }

  public buscarUniversidadesPorNombre(name:string):Observable<UniversidadDTO[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<UniversidadDTO[]>(this.baseUrl + this.rutaEndPoint + "/findUniversidadByName/" + name, {headers});
  }
  
  public getAllComents(idUniversidad:number):Observable<Number>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<Number>(this.baseUrl + this.rutaEndPoint + "/getAllComents/" + idUniversidad, {headers});
  }

  public eliminarUniversidad(id:number):Observable<string>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.delete<string>(this.baseUrl + this.rutaEndPoint + "/" + id, {headers});
  }
}
