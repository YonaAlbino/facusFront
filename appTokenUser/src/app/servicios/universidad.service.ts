import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { Observable } from 'rxjs';
import { Universidad } from '../modelo/universidad';

@Injectable({
  providedIn: 'root'
})
export class UniversidadService {
  constructor(private http: HttpClient) { }

  private baseUrl = Rutas.RUTA_BASE;
  private rutaEndPoint = "/universidad"

  public getUniversidades(): Observable<Universidad[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<Universidad[]>(this.baseUrl + this.rutaEndPoint, {headers});
  }

  public getUniversidadById(id: number): Observable<Universidad> {
    return this.http.get<Universidad>(this.baseUrl + this.rutaEndPoint + "/" + id);
  }

  public crearUniversidad(universidad: Universidad): Observable<Universidad> {
    return this.http.post(this.baseUrl + this.rutaEndPoint, universidad);
  }

  public editUniversidad(universidad: Universidad): Observable<Universidad> {
    return this.http.put(this.baseUrl + this.rutaEndPoint, universidad);
  }

  public obtenerTopUniversidades(pagina: number, tamanio: number): Observable<Universidad[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<Universidad[]>(`${this.baseUrl}${this.rutaEndPoint}/obtenerTopUniversidades?pagina=${pagina}&tamanio=${tamanio}`, { headers });
  }


  getuniversidadIdCarrera(idCarrera: number): Observable<Universidad> {
    return this.http.get<Universidad>(this.baseUrl + this.rutaEndPoint + "/universidadID/" + idCarrera);
  }
  
  obtenerUniversidadesPaginadas(pagina:number, tamanio:number):Observable<Universidad[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<Universidad[]>(`${this.baseUrl}${this.rutaEndPoint}/paginadas?pagina=${pagina}&tamanio=${tamanio}`, {headers});
  }

  public buscarUniversidadesPorNombre(name:string):Observable<Universidad[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<Universidad[]>(this.baseUrl + this.rutaEndPoint + "/findUniversidadByName/" + name, {headers});
  }

}
