import { Injectable } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { ContactoRequest } from '../modelo/contacto-request';
import { MensajeRetornoSimple } from '../modelo/mensaje-retorno-simple';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private rutaEndpoint = '/contacto';
  private rutaBase = Rutas.RUTA_BASE;

  constructor(private http: HttpClient) { }

  enviarMensaje(contactoRequest: ContactoRequest): Observable<MensajeRetornoSimple> {
    return this.http.post<MensajeRetornoSimple>(this.rutaBase + this.rutaEndpoint, contactoRequest);
  }

}
