import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CredencialesLogueo } from '../modelo/credenciales-logueo';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthLoguinResponseDTO } from '../modelo/auth-loguin-response-dto';
import { Rutas } from '../enumerables/rutas';
import { EnumsDTOs } from '../enums/enums-dtos';
import { UsuarioDTO } from '../modelo/UsuarioDTO';
import { MensajeRetornoSimple } from '../modelo/mensaje-retorno-simple';
import { RegistroRequest } from '../modelo/registro-request';
import { ActualizarContraseniaRequest } from '../modelo/actualizar-contrasenia-request';
import Swal from 'sweetalert2'

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

  private baseUrl = Rutas.RUTA_BASE;
  private rutaEndPoint = "/usuario";

  private fuenteIdUsuario = new BehaviorSubject<number | null>(null);
  idUsuarioActual = this.fuenteIdUsuario.asObservable();

  private rolUsuario = new BehaviorSubject<string | null>(null);
  rolActual = this.rolUsuario.asObservable();

  setUserId(id: number) {
    this.fuenteIdUsuario.next(id);
  }

  setRolUsuario(rol: string) {
    this.rolUsuario.next(rol);
  }

  public loguin(credenciales: CredencialesLogueo): Observable<AuthLoguinResponseDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.HttpClient.post<AuthLoguinResponseDTO>(this.baseUrl + "/loguin/password", credenciales, { headers: headers });
  }

  refreshToken(token: string): Observable<AuthLoguinResponseDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });

    return this.HttpClient.post<AuthLoguinResponseDTO>(this.baseUrl + "/getAccesToken", token, { headers: headers });
  }

  getIdRefreshToken(idUsuario: string): Observable<UsuarioDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.HttpClient.get<UsuarioDTO>(this.baseUrl + "/usuario" + "/" + idUsuario, { headers: headers });
  }

  public getUsuarios(): Observable<UsuarioDTO[]> {
    return this.HttpClient.get<UsuarioDTO[]>(this.baseUrl + this.rutaEndPoint);
  }

  public getUsuarioById(id: number): Observable<UsuarioDTO> {
    return this.HttpClient.get<UsuarioDTO>(this.baseUrl + this.rutaEndPoint + "/" + id)
  }

  public crearUsuario(usuario: UsuarioDTO): Observable<UsuarioDTO> {

    return this.HttpClient.post(this.baseUrl + this.rutaEndPoint, usuario);
  }

  public editUsuario(usuario: UsuarioDTO): Observable<UsuarioDTO> {
    return this.HttpClient.put(this.baseUrl + this.rutaEndPoint, usuario);
  }

  registro(registroRequest: RegistroRequest): Observable<MensajeRetornoSimple> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.HttpClient.post<MensajeRetornoSimple>(this.baseUrl + this.rutaEndPoint + "/registro", registroRequest, { headers: headers });
  }


  cambiarContrasenia(idUsuario: number, contrasenia: string): Observable<MensajeRetornoSimple> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true'
    });
    return this.HttpClient.post<MensajeRetornoSimple>(
      `${this.baseUrl}${this.rutaEndPoint}/cambiarContrasenia?idUsuario=${idUsuario}&nuevaContrasena=${contrasenia}`,
      { headers: headers }
    );
  }


  actualizarContrasenia(idUser: number, contraseniaActual: string, nuevaContrasenia: string): Observable<MensajeRetornoSimple> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true'
    });
    const actualizarContrasenia: ActualizarContraseniaRequest = {
      idUsuario: idUser,
      nuevaContrasenia: nuevaContrasenia,
      contraseniaActual: contraseniaActual
    }
    return this.HttpClient.post<MensajeRetornoSimple>(
      `${this.baseUrl}${this.rutaEndPoint}/actualizarContrasenia`,
      actualizarContrasenia,
      { headers: headers }
    );
  }


  public infraccionarUsuario(id: number): Observable<MensajeRetornoSimple> {
    return this.HttpClient.post<MensajeRetornoSimple>(this.baseUrl + this.rutaEndPoint + "/infraccionar/" + id, null);
  }

}
