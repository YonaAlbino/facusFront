import { Component } from '@angular/core';
import { AuthLoguinResponseDTO } from 'src/app/modelo/auth-loguin-response-dto';
import { UtilService } from 'src/app/servicios/util.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  role: string | null = null;

  constructor(private util: UtilService) { }

  ngOnInit(): void {
    this.role = this.obtenerRoleDeLocalStorage();
    const params = this.obtenerParametrosDeURL();

    if (this.validarParametros(params.token, params.role, params.idUsuario)) {
      const authLoguinResponseDTO = this.crearAuthLoguinResponseDTO(params);
      this.actualizarEstadoHistorial();
      this.guardarCredencialesEnSesion(authLoguinResponseDTO);
    }
  }

  private obtenerRoleDeLocalStorage(): string | null {
    return localStorage.getItem('userRole');
  }

  private obtenerParametrosDeURL(): { token: string | null, role: string | null, idUsuario: string | null } {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      token: urlParams.get('token'),
      role: urlParams.get('role'),
      idUsuario: urlParams.get('idUsuario')
    };
  }

  private validarParametros(token: string | null, role: string | null, idUsuario: string | null): boolean {
    return !!(token && role && idUsuario);
  }

  private crearAuthLoguinResponseDTO(params: { token: string | null, role: string | null, idUsuario: string | null }): AuthLoguinResponseDTO {
    return {
      role: params.role!,
      token: params.token!,
      id: Number(params.idUsuario)
    };
  }

  private actualizarEstadoHistorial(): void {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  private guardarCredencialesEnSesion(authLoguinResponseDTO: AuthLoguinResponseDTO): void {
    this.util.agregarCredencialesASesion(authLoguinResponseDTO);
  }
}
