import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenVerificacionEmailService } from 'src/app/servicios/token-verificacion-email.service';

@Component({
  selector: 'app-token-verificacion-error',
  templateUrl: './token-verificacion-error.component.html',
  styleUrls: ['./token-verificacion-error.component.css']
})
export class TokenVerificacionErrorComponent implements OnInit {

  idTokenVerificador: any;
cargando: boolean | undefined;

  constructor(private route: ActivatedRoute, private tokenVerificacion: TokenVerificacionEmailService) { }

  ngOnInit(): void {
    this.capturarIdTokenUrl();
  }

  actualizarTokenVerificacionEmail(): void {
    this.cargando = true;
    this.tokenVerificacion.actualizarTokenVerificacion(this.idTokenVerificador)
      .subscribe({
        next: (response) => {
          console.log('Token actualizado con éxito', response);
          this.cargando = false;
        },
        error: (error) => {
          // Aquí se maneja el error
          console.error('Error al actualizar el token:', error);
          this.cargando = false;
        }
      });
  }

  capturarIdTokenUrl() {
    this.idTokenVerificador = this.route.snapshot.paramMap.get('idTokenVerificador');
    console.log('ID del token verificador:', this.idTokenVerificador);
  }

}
