
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
import { AlertasService } from '../servicios/alertas.service';
import { SonidoService } from '../servicios/sonido-service.service';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private util: UtilService,
    private usuarioService: UsuarioService,
    private errorService: ErrorServiceService,
    private alertaService: AlertasService,
    private sonidoService: SonidoService
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
            return throwError(() => new Error('El token ha expirado, necesitas voler a loguarte'));
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



  private handleError(httpResponse: HttpErrorResponse): Observable<never> {
    this.sonidoService.error();
    let mensajeError = 'Ocurrió un error desconocido';

    if (httpResponse.error instanceof ErrorEvent) {
      // Error del cliente
      mensajeError = `Error del cliente: ${httpResponse.error.message}`;
    } else if (httpResponse.error && httpResponse.error.code && httpResponse.error.message) {
      // Error del servidor con código y mensaje personalizado
      mensajeError = `Código ${httpResponse.error.code}: ${httpResponse.error.message}`;
    } else {
      // Error genérico del servidor
      mensajeError = `Error del servidor: ${httpResponse.status} - ${httpResponse.message}`;
    }

    // Manejo de errores específicos según el código personalizado
    if (httpResponse.error?.code === 401 || httpResponse.status == 401) {
    
      if (httpResponse.error.message === "Token inválido") {
        console.log("11111111111111111111111111111111111111111111")
        //this.alertaService.error("Tu token de seguridad ha expirado, necesitas volver a loguarte");
        this.router.navigate(['/loguin']);
      }

    }

    // Registrar el error en el servicio de errores
    // this.errorService.reportError(mensajeError);

    // Mostrar un mensaje amigable al usuario si es necesario
    this.alertaService.error(mensajeError);

    // Lanzar el error para que los componentes puedan reaccionar si es necesario
    return throwError(() => new Error(mensajeError));
  }



}