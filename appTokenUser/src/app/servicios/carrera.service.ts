import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rutas } from '../enumerables/rutas';
import { EnumsDTOs } from '../enums/enums-dtos';
import { CarreraDTO } from '../modelo/CarreraDTO';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  getAllComents(idCarrera: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<Number>(this.rutaBase + this.rutaEndPoint + "/getAllComents/" + idCarrera, { headers });
  }

  constructor(private http: HttpClient) { }
  private rutaBase = Rutas.RUTA_BASE;
  private rutaEndPoint = "/carrera"

  getCarreras(): Observable<CarreraDTO[]> {
    return this.http.get<CarreraDTO[]>(this.rutaBase + this.rutaEndPoint)
  }

  getCarreraByID(id: number): Observable<CarreraDTO> {
    return this.http.get<CarreraDTO>(this.rutaBase + this.rutaEndPoint + "/" + id);
  }

  crearCarrera(carrera: CarreraDTO): Observable<CarreraDTO> {
    const carreraConClass = {
      ...carrera,
      '@class': EnumsDTOs.CarreraDTO
    };

    return this.http.post<CarreraDTO>(this.rutaBase + this.rutaEndPoint, carreraConClass);
  }

  editCarrera(carrera: CarreraDTO): Observable<CarreraDTO> {
   console.log(carrera);
    return this.http.put<CarreraDTO>(this.rutaBase + this.rutaEndPoint, carrera);
  }

  public obtenerTopCarreras(pagina: number, tamanio: number): Observable<CarreraDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<CarreraDTO[]>(`${this.rutaBase}/carrera/obtenerTopCarreras?pagina=${pagina}&tamanio=${tamanio}`, { headers });
  }


}
