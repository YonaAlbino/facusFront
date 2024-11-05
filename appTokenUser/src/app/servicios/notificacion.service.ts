import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilService } from './util.service';
import { Rutas } from '../enumerables/rutas';
import { EnumsDTOs } from '../enums/enums-dtos';
import { NotificacionDTO } from '../modelo/NotificacionDTO';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private baseUrl = Rutas.RUTA_BASE;
  private rutaEndpoint = "/notificacion"

  constructor(private http: HttpClient) { }

  getNotificacionesByUserId(idUser: number): Observable<NotificacionDTO[]> {
    return this.http.get<NotificacionDTO[]>(`${this.baseUrl + this.rutaEndpoint + "/byUserId"}/${idUser}`);
  }

  // getNotificacionesFalseByUserId(idUser:number):Observable<Notificacion[]>{
  //   return this.http.get<Notificacion[]>(`${this.baseUrl}/false/${idUser}`);
  // }

  getNotificacionesNoLeidas(idUser: number): Observable<NotificacionDTO[]> {
    return this.http.get<NotificacionDTO[]>(this.baseUrl + this.rutaEndpoint + "/noLeidas/" + idUser);
  }

  visualizarNotificacionesByUserID(userId: number): Observable<string> {
    const url = this.baseUrl + this.rutaEndpoint + "/visualizarNotificacionesByUserID/" + userId;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<string>(url, { headers });
  }

  // eliminarNotificacion(idNotificacion: number, idUsuario: number) {
  //   //return this.http.put<string>(`${this.baseUrl}/${idNotificacion}/${idUsuario}`, null);
  //   return this.http.put<string>(this.baseUrl + this.rutaEndpoint + "/" + idNotificacion + "/" + idUsuario, null);
  // }

  eliminarUsuarioAsignado(idNotificacion: number, idUsuario: number): Observable<string> {
    const url = `${this.baseUrl}/${idNotificacion}/${idUsuario}`;
    return this.http.put<string>(url, {});
  }

  getNotificaciones(): Observable<NotificacionDTO[]> {
    return this.http.get<NotificacionDTO[]>(this.baseUrl + this.rutaEndpoint);
  }

  getNotificacionById(id:number):Observable<NotificacionDTO>{
    return this.http.get<NotificacionDTO>(this.baseUrl + this.rutaEndpoint + "/" + id);
  }

  eliminarNotificacion(id:number):Observable<string>{
    return this.http.delete<string>(this.baseUrl + this.rutaEndpoint + "/" + id);
  }

  crearNotificacion(notificacion:NotificacionDTO):Observable<NotificacionDTO>{
    const notificacionClass = {
      ...notificacion,  
      '@class': EnumsDTOs.NotificacionDTO  
    };
    return this.http.post(this.baseUrl + this.rutaEndpoint, notificacionClass);
  }

  editNotificacion(notificacion:NotificacionDTO):Observable<NotificacionDTO>{
    return this.http.put(this.baseUrl + this.rutaEndpoint,notificacion);
  }
}