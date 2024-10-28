import { Injectable, OnInit } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, Observable } from 'rxjs';
import { UsuarioService } from './usuario.service';
import { EnumsDTOs } from '../enums/enums-dtos';
import { RespuestaDTO } from '../modelo/RespuestaDTO';

@Injectable({
  providedIn: 'root'
})
export class RespuestaService implements OnInit {
  idUsuarioActual: number | undefined;

  constructor(private http: HttpClient, private userService: UsuarioService) { }

  ngOnInit(): void {
    this.userService.idUsuarioActual.subscribe(idUsuario => {
      if (idUsuario !== null)
        this.idUsuarioActual = idUsuario;
    });
  }

  private rutaEndpoint = '/respuesta';
  private rutaBase = Rutas.RUTA_BASE;

  public guardarRespuesta(respuesta: RespuestaDTO, idUsuario: number): Observable<RespuestaDTO> {
    // console.log(respuesta)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log(respuesta)

    return this.http.post<RespuestaDTO>(this.rutaBase + this.rutaEndpoint, respuesta, { headers: headers })
      .pipe(
        map((respuesta: RespuestaDTO) => {
          const respuestaJSON = JSON.stringify(respuesta);
          const respuestaObjeto = JSON.parse(respuestaJSON);
          return respuestaObjeto;
        }),
        catchError((error) => {
          console.log(error);
          throw error;
        })
      );
  }


  crearRespuesta(mensaje: string): Observable<RespuestaDTO> {
    let respuesta: RespuestaDTO = {
      mensaje: mensaje,
    }
    return this.guardarRespuesta(respuesta, this.idUsuarioActual!);
  }


  actualizarRespuesta(respuestaOriginal: RespuestaDTO): Observable<any> {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json'
    // });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const respuestaClass = {
      ...respuestaOriginal,
      '@class': EnumsDTOs.RespuestaDTO
    };
    return this.http.put(this.rutaBase + this.rutaEndpoint, respuestaClass);
  }

}
