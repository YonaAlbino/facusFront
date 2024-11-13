import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MensajeRetornoSimple } from 'src/app/modelo/mensaje-retorno-simple';
import { RegistroRequest } from 'src/app/modelo/registro-request';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  registerForm: FormGroup;
  mostrarContrasenia = false;
  tokenCaptcha: string | undefined;
  cuentaCreada:boolean = false;
  cargando:boolean = false;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.fortalezaContrasenias]],
      repeatPassword: ['', Validators.required],
      showPassword: [false],
      recaptcha: ['', Validators.required] // Agregar campo de reCAPTCHA
    }, { validators: this.coincidenciaContrasenias });
  }

  // Validación personalizada para verificar que las contraseñas coincidan
  coincidenciaContrasenias(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const repeatPassword = form.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { concidencia: true };
  }

  // Validación personalizada para la fortaleza de la contraseña
  fortalezaContrasenias(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const mayuscula = /[A-Z]/.test(password);
    const miniscula = /[a-z]/.test(password);
    const numero = /\d/.test(password);
    const caracterEspecial = /[@$!%*?&#]/.test(password);
    const esValida = mayuscula && miniscula && numero && caracterEspecial;
    return esValida ? null : { contraseniaValida: true };
  }

  // Método que se ejecuta cuando se envía el formulario
  enviar() {
    if (this.registerForm.valid && this.tokenCaptcha) { // Verificamos que el reCAPTCHA esté resuelto
      this.cargando = true;
      const registroRequest: RegistroRequest = {
        captchaToken: this.tokenCaptcha, // Token obtenido del reCAPTCHA
        email: this.registerForm.get('email')?.value,
        contrasenia: this.registerForm.get('password')?.value // Corregido el campo 'contrasenia'
      }

      // Llamada al servicio de registro
      this.usuarioService.registro(registroRequest).subscribe(
        (mensajeRetornoSimple: MensajeRetornoSimple) => {
          console.log("Registro exitoso: ", mensajeRetornoSimple);
          this.cuentaCreada  = true;
          this.cargando = false;
        },
        (error) => {
          console.error("Error en el registro: ", error);
          this.cargando = false;
        }
      );

    } else {
      console.log("error")
      // Si el formulario no es válido o el reCAPTCHA no ha sido resuelto
      this.registerForm.markAllAsTouched();
    }
  }

  // Método para iniciar sesión con Google
  logueoOauth() {
    console.log('Iniciar sesión con Google');
  }

  // Método que se ejecuta cuando el reCAPTCHA es resuelto
  onCaptchaResolved($event: string) {
    this.tokenCaptcha = $event; // Asignamos el token de reCAPTCHA
    this.registerForm.get('recaptcha')?.setValue(this.tokenCaptcha);
    this.registerForm.get('recaptcha')?.markAsTouched();  // Marcar como tocado
  }
}
