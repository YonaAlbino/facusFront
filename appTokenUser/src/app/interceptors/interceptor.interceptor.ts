
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { UtilService } from '../servicios/util.service';
import { UsuarioService } from '../servicios/usuario.service';
import { AuthLoguinResponseDTO } from '../modelo/auth-loguin-response-dto';
import { Usuario } from '../modelo/usuario';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,                
    private util: UtilService,             
    private usuarioService: UsuarioService 
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Verificar si la solicitud contiene el encabezado 'Skip-Interceptor'.
    const skipInterceptor = request.headers.has('Skip-Interceptor');
    if (skipInterceptor) {
      const modifiedRequest = request.clone({
        headers: request.headers.delete('Skip-Interceptor'),
        // setHeaders: {
        //   'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
        // }
      });
      return next.handle(modifiedRequest); // Se envía la solicitud modificada sin más procesamiento.
    }
    // Obtener el token de autenticación (authToken) almacenado en localStorage.
    const authToken = localStorage.getItem('authToken');

    // Si el authToken existe, se compeurba si ha expirado.
    if (authToken) {
      if (this.util.verificarTokenInactivo()) {
        // Si el token está inactivo (ha expirado), se renuvea usando el refresh token.
        return this.refreshToken(request, next);
      } else {
        // Si el token es válido, agregamos el authToken a la solicitud directamente.
        const cloneRequest = request.clone({
          setHeaders: {
            'Authorization': `Bearer ${authToken}` // Agregamos el authToken directamente en el encabezado.
          }
        });
        return next.handle(cloneRequest).pipe(
          // En caso de error, manejamos el error a través de handleError.
          catchError(error => this.handleError(error))
        );
      }
    }
    // Si no hay authToken, simplemente manejamos la solicitud sin agregar encabezados.
    return next.handle(request).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private refreshToken(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const idUsuario = localStorage.getItem("userID");
    // Si no hay ID de usuario, se lanza un error.
    if (!idUsuario) {
      return throwError(() => new Error('No hay ID de usuario disponible'));
    }
    // Obtiene el usuario y su refreshToken
    return this.usuarioService.getIdRefreshToken(idUsuario).pipe(
      switchMap((usuario: Usuario) => {
        const refreshToken = usuario.refreshToken?.token;
        // Si no hay refresh token, se lanza un error.
        if (!refreshToken) {
          return throwError(() => new Error('No hay refresh token disponible'));
        }
        // Se realiza la solicitud de renovación del token usando el refresh token.
        return this.usuarioService.refreshToken(refreshToken).pipe(
          switchMap((authResponse: AuthLoguinResponseDTO) => {
            // Guardamos las nuevas credenciales en la sesión (por ejemplo, authToken y refreshToken).
            this.util.agregarCredencialesASesion(authResponse);
            // Clonamos la solicitud original con el nuevo token de autenticación.
            const cloneRequest = request.clone({
              setHeaders: {
                'Authorization': `Bearer ${authResponse.token}` // Añadimos el nuevo authToken directamente en el encabezado.
              }
            });
            return next.handle(cloneRequest); // Procesamos la solicitud con el nuevo token.
          }),
          catchError(error => {
            // Si la renovación del token falla, redirigimos al usuario a la página de login.
            this.handleError(error);
            return throwError(() => new Error('Error al renovar el token'));
          })
        );
      }),
      catchError(error => {
        // Maneja errores al obtener el usuario
        this.handleError(error);
        return throwError(() => new Error('Error al obtener el usuario'));
      })
    );
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let mensajeError = 'Error desconocido'; // Mensaje de error por defecto.
    // Si el error es del cliente (ErrorEvent), obtenemos el mensaje de error del cliente.
    if (error.error instanceof ErrorEvent) {
      mensajeError = `Error del cliente: ${error.error.message}`;
    } else {
      // Si es un error del servidor, obtenemos el estado HTTP y el mensaje del servidor.
      mensajeError = `Error del servidor: ${error.status} - ${error.error.message}`;
    }
    // Si el error es un 401 (no autorizado), posiblemente el token ha expirado o es inválido.
    if (error.status === 401) {
      mensajeError += ' - Necesitas volver a iniciar sesión';
      // Mostramos un mensaje y redirigimos al usuario a la página de login.
      this.util.cuentaAtras("Token caducado, necesitas volver a iniciar sesión", 3000, () => {
        this.router.navigate(['/loguin']); // Redirigir a la página de login.
      });
    }
    if (error.status === 403) {
      mensajeError += ' -No tienes los permisos necesarios para realizar esta acción';
    }
    // Imprimir el error en la consola para depuración.
    console.error(mensajeError);
    // Devolvemos un error utilizando throwError para que sea capturado por quien llamó al interceptor.
    return throwError(() => new Error(mensajeError));
  }
}
