import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CredencialesLogueo } from '../modelo/credenciales-logueo';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthLoguinResponseDTO } from '../modelo/auth-loguin-response-dto';
import { UtilService } from './util.service';
import { Usuario } from '../modelo/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private HttpClient: HttpClient) {
    const rolUsuario = localStorage.getItem('userRole');  
    if (rolUsuario) {
      this.rolUsuario.next(rolUsuario);
    }
   }

  private fuenteIdUsuario = new BehaviorSubject<number | null>(null);
  idUsuarioActual = this.fuenteIdUsuario.asObservable();

  private rolUsuario = new BehaviorSubject<string | null>(null);
  rolActual = this.rolUsuario.asObservable();

  setUserId(id:number){
    this.fuenteIdUsuario.next(id);
  }

  setRolUsuario(rol:string){
    this.rolUsuario.next(rol);
  }

  public loguin(credenciales: CredencialesLogueo): Observable<AuthLoguinResponseDTO> {
    const url = "http://localhost:8080/loguin/password";

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.HttpClient.post<AuthLoguinResponseDTO>(url, credenciales, { headers: headers });
  }


  refreshToken(token: string): Observable<AuthLoguinResponseDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.HttpClient.post<AuthLoguinResponseDTO>("http://localhost:8080/getAccesToken", token, { headers: headers });
  }

  getIdRefreshToken(idUsuario: string): Observable<Usuario> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.HttpClient.get<Usuario>("http://localhost:8080/usuario" + "/" + idUsuario, { headers: headers });
  }
}
