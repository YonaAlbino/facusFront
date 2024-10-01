import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Comentario } from '../modelo/comentario';
import { UtilService } from './util.service';


@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

 private rutaEndpoint = '/comentario'; 
 private token = localStorage.getItem('authToken'); // O donde almacenes tu token

  constructor(private http:HttpClient, private util:UtilService) { }

  getComentarios():Observable<Comentario[]>{
    return this.http.get<Comentario[]>(this.util.getUrlBase() + this.rutaEndpoint);
  }

  getComentarioById(id:number):Observable<Comentario>{
    return this.http.get<Comentario>(this.util.getUrlBase() + this.rutaEndpoint + "/" + id);
  }

  guardarComentario(mensaje:string):Observable<Comentario>{
    const comentarioAGuardar: Comentario = {
      mensaje: mensaje,
    }
    return this.http.post<Comentario>(this.util.getUrlBase() + this.rutaEndpoint, comentarioAGuardar);
  }

}
