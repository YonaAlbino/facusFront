import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notificacion } from '../modelo/notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private baseUrl = 'http://localhost:8080/notificacion'; 

  constructor(private http:HttpClient) { }

  getNotificacionesByUserId(idUser:number):Observable<Notificacion[]>{
    return this.http.get<Notificacion[]>(`${this.baseUrl+"/byUserId"}/${idUser}`);
  }

  // getNotificacionesFalseByUserId(idUser:number):Observable<Notificacion[]>{
  //   return this.http.get<Notificacion[]>(`${this.baseUrl}/false/${idUser}`);
  // }

  getNotificacionesNoLeidas(idUser:number):Observable<Notificacion[]>{
    return this.http.get<Notificacion[]>(`${this.baseUrl}/noLeidas/${idUser}`);
  }


  visualizarNotificacionesByUserID(userId: number): Observable<string> {
    const url = `${this.baseUrl}/visualizarNotificacionesByUserID/${userId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<string>(url, { headers });
  }

  // eliminarNotificacion(idNotificacion:number, idUsuario:number){
  //   return this.http.put<string>(`${this.baseUrl}/${idNotificacion}/${idUsuario}`, null);
  // }

  eliminarUsuarioAsignado(idNotificacion: number, idUsuario: number): Observable<string> {
    const url = `${this.baseUrl}/${idNotificacion}/${idUsuario}`;
    return this.http.put<string>(url, {});
  }
}
