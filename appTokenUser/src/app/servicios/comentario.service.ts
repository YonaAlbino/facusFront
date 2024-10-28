import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { Rutas } from '../enumerables/rutas';
import { EnumsDTOs } from '../enums/enums-dtos';
import { ComentarioDTO } from '../modelo/ComentarioDTO';


@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private rutaEndpoint = '/comentario';
  private rutaBase = Rutas.RUTA_BASE;

  constructor(private http: HttpClient) { }

  getComentarios(): Observable<ComentarioDTO[]> {
    return this.http.get<ComentarioDTO[]>(this.rutaBase + this.rutaEndpoint);
  }

  getComentarioById(id: number): Observable<ComentarioDTO> {
    return this.http.get<ComentarioDTO>(this.rutaBase  + this.rutaEndpoint + "/" + id);
  }

  guardarComentario(comentario: ComentarioDTO, idUsuario:number): Observable<ComentarioDTO> {
    return this.http.post<ComentarioDTO>(this.rutaBase  + this.rutaEndpoint, comentario);
  }

  eliminarComentario(id: number): Observable<string> {
    return this.http.delete<string>(this.rutaBase + this.rutaEndpoint + "/" + id);
  }

  editComentario(comentario:ComentarioDTO): Observable<ComentarioDTO> {
    const comentarioClass = {
      ...comentario,  
      '@class': EnumsDTOs.ComentarioDTO  
    };
    return this.http.put<ComentarioDTO>(this.rutaBase  + this.rutaEndpoint, comentarioClass);
  }

  CargarComentariosPaginadosCarrera(pagina:number, tamanio:number, idCarrera:number):Observable<ComentarioDTO[]>{
    return this.http.get<ComentarioDTO[]>(this.rutaBase+"/comentario/encontrarComentariosPorIdCarrera/"+idCarrera+"?pagina="+pagina+"&tamanio="+tamanio);
  }

  CargarComentariosPaginadosUniversidad(pagina:number, tamanio:number, idUniversidad:number):Observable<ComentarioDTO[]>{
    return this.http.get<ComentarioDTO[]>(this.rutaBase+"/comentario/encontrarComentariosPorIdUniversidad/"+idUniversidad+"?pagina="+pagina+"&tamanio="+tamanio);
  }
  

}
