import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PrincipalComponent } from './componentes/componente principal/principal/principal.component';
import { LogueoComponent } from './componentes/logueo/logueo.component';
import { EsuchaSocketComponent } from './componentes/esucha-socket/esucha-socket.component';
import { NotificacionesComponent } from './componentes/notificaciones/notificaciones.component';
import { DetalleNotificacionComponent } from './componentes/detalle-notificacion/detalle-notificacion.component';
import { ComentarioComponent } from './componentes/comentario/comentario.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { ErroresComponent } from './componentes/errores/errores.component';
import { InterceptorInterceptor } from './interceptors/interceptor.interceptor';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { UniversidadComponent } from './componentes/universidad/universidad.component';
import { CarreraComponent } from './componentes/carrera/carrera.component';
import { CalificacionComponent } from './componentes/calificacion/calificacion.component';
import { PermisoComponent } from './componentes/permiso/permiso.component';
import { ReaccionComponent } from './componentes/reaccion/reaccion.component';



const routes: Routes = [
  { path: '', component: PrincipalComponent }, 
  { path: 'loguin', component: LogueoComponent }, 
  { path: 'escucha', component: EsuchaSocketComponent },
  { path: 'notificaciones', component: NotificacionesComponent },
  { path: 'detalleNotificacion/:id', component: DetalleNotificacionComponent},
  { path: 'comentarios', component: ComentarioComponent},
  { path: 'loguin', component: LogueoComponent},
  { path: 'usuario', component: UsuarioComponent},
  { path: 'universidad', component: UniversidadComponent},
  { path: 'carrera', component: CarreraComponent},
  { path: 'calificacion', component: CalificacionComponent},
  { path: 'permiso', component: PermisoComponent},
  { path: 'reaccion', component: ReaccionComponent},
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
  
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
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
