import { Component, OnInit } from '@angular/core';
import { AuthLoguinResponseDTO } from 'src/app/modelo/auth-loguin-response-dto';
import { UtilService } from 'src/app/servicios/util.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  role: string | null = localStorage.getItem('userRole');
  idUsuarioLogueado: number | undefined;
  constructor(
    private util: UtilService
  ) { }

  ngOnInit(): void {
    this.manejarParametrosUrl();
    this.idUsuarioLogueado = Number(localStorage.getItem("userID"));
  }

  private manejarParametrosUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const role = urlParams.get('role');
    const idUsuario = urlParams.get('idUsuario');

    if (this.validarParametrosUrl(token, role, idUsuario)) {
      const authLoguinResponseDTO: AuthLoguinResponseDTO = {
        role: role!,
        token: token!,
        id: Number(idUsuario)
      };

      this.util.agregarCredencialesASesion(authLoguinResponseDTO);
      // Limpiar los parámetros de la URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }

  private validarParametrosUrl(token: string | null, role: string | null, idUsuario: string | null): boolean {
    return token !== null && role !== null && idUsuario !== null && !isNaN(Number(idUsuario));
  }
}
