import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class PruebaService {

  // private topicAdmin = "/tema/admin";
  // private topicUser = "/tema/usuario"

  private authUrl = 'http://localhost:8080/login'; // URL del endpoint de autenticación en Spring Boot

  constructor() { }

  login() {
    window.location.href = this.authUrl; // Redirige al usuario a la página de inicio de sesión de Google
  }



}