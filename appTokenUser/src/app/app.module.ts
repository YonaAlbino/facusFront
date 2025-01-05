import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PrincipalComponent } from './componentes/componente principal/principal/principal.component';
import { LogueoComponent } from './componentes/logueo/logueo.component';
import { EsuchaSocketComponent } from './componentes/esucha-socket/esucha-socket.component';
import { NotificacionesComponent } from './componentes/notificaciones/notificaciones.component';
import { ComentarioComponent } from './componentes/comentario/comentario.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErroresComponent } from './componentes/errores/errores.component';
import { InterceptorInterceptor } from './interceptors/interceptor.interceptor';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { UniversidadComponent } from './componentes/universidad/universidad.component';
import { CarreraComponent } from './componentes/carrera/carrera.component';
import { CalificacionComponent } from './componentes/calificacion/calificacion.component';
import { PermisoComponent } from './componentes/permiso/permiso.component';
import { ReaccionComponent } from './componentes/reaccion/reaccion.component';
import { CarruselComponent } from './componentes/carrusel/carrusel.component';
import { TopCarreraComponent } from './componentes/top-carrera/top-carrera.component';
import { DetalleUniversidadComponent } from './componentes/detalle-universidad/detalle-universidad.component';
import { TopUniversidadComponent } from './componentes/top-universidad/top-universidad.component';
import { PromedioCalificacionComponent } from './componentes/promedio-calificacion/promedio-calificacion.component';
import { CuerpoComponent } from './componentes/cuerpo/cuerpo.component';
import { BarraBusquedaComponent } from './componentes/barra-busqueda/barra-busqueda.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { ErrorComponent } from './componentes/error/error.component';
import { AgregarUniversidadComponent } from './componentes/agregar-universidad/agregar-universidad.component';
import { PuntuacionComponent } from './componentes/puntuacion/puntuacion.component';
import { DetallesNotificacionComponent } from './componentes/detalles-notificacion/detalles-notificacion.component';
import { TokenVerificacionErrorComponent } from './componentes/token-verificacion-error/token-verificacion-error.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { RecuperarContraseniaComponent } from './componentes/recuperar-contrasenia/recuperar-contrasenia.component';
import { ReestablecerContraseniaComponent } from './componentes/reestablecer-contrasenia/reestablecer-contrasenia.component';
import { AgregacionCarreraComponent } from './componentes/agregacion-carrera/agregacion-carrera.component';






const routes: Routes = [
  { path: '', component: PrincipalComponent }, 
  { path: 'loguin', component: LogueoComponent }, 
  { path: 'escucha', component: EsuchaSocketComponent },
  { path: 'notificaciones', component: NotificacionesComponent },
  { path: 'detalleNotificacion/:id', component: DetallesNotificacionComponent},
  { path: 'comentarios', component: ComentarioComponent},
  { path: 'loguin', component: LogueoComponent},
  { path: 'usuario', component: UsuarioComponent},
  { path: 'universidad', component: UniversidadComponent},
  { path: 'carrera', component: CarreraComponent},
  { path: 'calificacion', component: CalificacionComponent},
  { path: 'permiso', component: PermisoComponent},
  { path: 'reaccion', component: ReaccionComponent},
  { path: 'carrusel', component: CarruselComponent},
  { path: 'topCarrera', component: TopCarreraComponent},
  { path: 'detalleUniversidad/:id', component: DetalleUniversidadComponent},
  { path: 'detalleUniversidad/:id/:carreraId', component: DetalleUniversidadComponent },
  { path: 'topUniversidad', component: TopUniversidadComponent},
  { path: 'cuerpo', component: CuerpoComponent},
  { path: 'barraBusqueda', component: BarraBusquedaComponent},
  { path: 'footer', component: FooterComponent},
  { path: 'agregarUniversidad', component: AgregarUniversidadComponent},
  { path: 'error/token/:idTokenVerificador', component: TokenVerificacionErrorComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'recuperarContrasenia', component: RecuperarContraseniaComponent },
  { path: 'reestablecerContrasenia', component: ReestablecerContraseniaComponent },
  { path: 'agregarCarrera/:id', component: AgregacionCarreraComponent },


  // Otras rutas
];

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    LogueoComponent,
    EsuchaSocketComponent,
    NotificacionesComponent,
    ComentarioComponent,
    NavbarComponent,
    ErroresComponent,
    UsuarioComponent,
    UniversidadComponent,
    CarreraComponent,
    CalificacionComponent,
    PermisoComponent,
    ReaccionComponent,
    CarruselComponent,
    TopCarreraComponent,
    DetalleUniversidadComponent,
    TopUniversidadComponent,
    PromedioCalificacionComponent,
    CuerpoComponent,
    BarraBusquedaComponent,
    FooterComponent,
    ErrorComponent,
    AgregarUniversidadComponent,
    PuntuacionComponent,
    DetallesNotificacionComponent,
    TokenVerificacionErrorComponent,
    RegistroComponent,
    PerfilComponent,
    RecuperarContraseniaComponent,
    ReestablecerContraseniaComponent,
    AgregacionCarreraComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorInterceptor,
      multi: true // Permite múltiples interceptores
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
