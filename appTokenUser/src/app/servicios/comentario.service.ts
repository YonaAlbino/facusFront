import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { Comentario } from '../modelo/comentario';
import { UtilService } from './util.service';
import { Reaccion } from '../modelo/reaccion';
import { Usuario } from '../modelo/usuario';
import { Rutas } from '../enumerables/rutas';


@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private rutaEndpoint = '/comentario';
  private rutaBase = Rutas.RUTA_BASE;

  constructor(private http: HttpClient) { }

  getComentarios(): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(this.rutaBase + this.rutaEndpoint);
  }

  getComentarioById(id: number): Observable<Comentario> {
    return this.http.get<Comentario>(this.rutaBase  + this.rutaEndpoint + "/" + id);
  }

  guardarComentario(comentario: Comentario): Observable<Comentario> {
    return this.http.post<Comentario>(this.rutaBase  + this.rutaEndpoint, comentario);
  }

  eliminarComentario(id: number): Observable<string> {
    return this.http.delete<string>(this.rutaBase + this.rutaEndpoint + "/" + id);
  }

  editComentario(comentario:Comentario): Observable<Comentario> {
    return this.http.put<Comentario>(this.rutaBase  + this.rutaEndpoint, comentario);
  }

}
