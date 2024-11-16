
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

import { ErrorServiceService } from '../servicios/error-service.service';
import { UsuarioDTO } from '../modelo/UsuarioDTO';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private util: UtilService,
    private usuarioService: UsuarioService,
    private errorService: ErrorServiceService
  ) { }

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
      return next.handle(modifiedRequest).pipe(
        catchError(error => this.handleError(error)) // Manejo de errores aquí
      );
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
      switchMap((usuario: UsuarioDTO) => {
        console.log("el usuario es " + usuario)
        const refreshToken = usuario.refreshToken?.token;
        console.log("token refresco " + refreshToken)
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
    let mensajeError = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      mensajeError = `Error del cliente: ${error.error.message}`;
    } else {
      mensajeError = `Error del servidor: ${error.status} - ${error.message}`;
    }

    // Llama a reportError con el mensaje de error detallado
    this.errorService.reportError(mensajeError);

    // Si el error es un 401
    if (error.status === 401) {
      this.util.cuentaAtras("Token caducado, necesitas volver a iniciar sesión", 3000, () => {
        this.router.navigate(['/loguin']);
      });
    }

    return throwError(() => new Error(mensajeError));
  }


}
