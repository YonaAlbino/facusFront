
import { Injectable, OnDestroy } from '@angular/core';
import { Stomp, CompatClient } from '@stomp/stompjs';
import { Subject, BehaviorSubject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  private stompClient: CompatClient | null = null;
  private readonly maxIntentosSubscribicionToken = 5;
  private intentosSubscribicionTopic = 0;
  private topics: string[] = []; // Lista para múltiples topics
  private messageSubjects: { [topic: string]: Subject<string> } = {}; // Almacenar subjects para cada topic
  private connectionState = new BehaviorSubject<boolean>(false); // Estado de conexión  
  private idUsuario:number | undefined;
  private readonly WEBSOCKET_URL = "http://localhost:8080/websocket"; // Centralizamos la URL

  constructor(private userService: UsuarioService) {

    this.userService.idUsuarioActual.subscribe(id => {
      if(id){
        this.idUsuario = id;
        this.userService.rolActual.subscribe(rolUsuario => {
          if (rolUsuario) {
            this.iniciarConexionSocket(rolUsuario);
          }
        });
      }
    })
  }

  // Definir los topics en función del rol del usuario
  private capturarTopics(rolUsuario: string) {
    this.topics = []; // Limpiar la lista de topics previos
    if (rolUsuario === 'ROLE_ADMIN') {
      this.topics.push('/tema/admin/notificacion');
      this.topics.push('/tema/usuario/' + this.idUsuario); // Añadir segundo topic para admin
    } else if (rolUsuario === 'ROLE_USER') {
      this.topics.push('/tema/usuario/notificacion');
      this.topics.push('/tema/usuario/' + this.idUsuario); // Añadir segundo topic para usuario
    }
    // Crear un `Subject` para cada topic
    this.topics.forEach(topic => {
      this.messageSubjects[topic] = new Subject<string>();
    });
  }

  // Iniciar conexión WebSocket
  public iniciarConexionSocket(rolUsuario: string) {
    this.capturarTopics(rolUsuario); // Actualiza los topics basados en el rol
    const socket = new SockJS(this.WEBSOCKET_URL);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      console.log('Conexión WebSocket establecida');
      this.connectionState.next(true); // Emitir el estado de conexión
      this.suscribirseATopics(); // Suscribirse a múltiples topics
    }, (error: any) => {
      console.error('Error en la conexión WebSocket: ', error);
      this.connectionState.next(false); // Emitir el estado de desconexión
      this.reconectarWebSocket(rolUsuario);
    });
  }

  // Suscribirse a múltiples topics
  private suscribirseATopics() {
    if (this.stompClient?.connected) {
      this.topics.forEach(topic => {
        this.suscribirseAlTopic(topic);
      });
    } else {
      console.error('No se puede suscribir a los topics, WebSocket no está conectado');
    }
  }

  // Suscribirse a un solo topic
  private suscribirseAlTopic(topic: string) {
    if (this.stompClient?.connected) {
      this.stompClient.subscribe(topic, (respuesta: any) => {
        this.intentosSubscribicionTopic = 0;
        this.messageSubjects[topic].next(respuesta.body);
        console.log(`Mensaje en ${topic}: ${respuesta.body}`);
      });
    } else {
      console.error(`No se puede suscribir al tópico ${topic}, WebSocket no está conectado`);
      this.reSuscribirseAlTopic(this.intentosSubscribicionTopic, topic);
    }
  }

  // Intentar resuscribir con retardo exponencial
  private reSuscribirseAlTopic(intentos: number, topic: string) {
    if (intentos < this.maxIntentosSubscribicionToken) {
      this.intentosSubscribicionTopic++;
      const delay = Math.min(3000 * Math.pow(2, intentos), 60000); // Retardo exponencial
      setTimeout(() => {
        this.suscribirseAlTopic(topic);
      }, delay);
    } else {
      console.error(`Número máximo de intentos de suscripción alcanzado para el topic ${topic}`);
    }
  }

  // Método para reconectar WebSocket
  private reconectarWebSocket(rolUsuario: string) {
    setTimeout(() => {
      console.log('Intentando reconectar WebSocket...');
      this.iniciarConexionSocket(rolUsuario);
    }, 5000); // Intentar reconectar en 5 segundos
  }

  // Obtener observable de mensajes para un topic
  public getMessages(topic: string) {
    return this.messageSubjects[topic]?.asObservable();
  }

  // Obtener el estado de conexión
  public getConnectionState() {
    return this.connectionState.asObservable();
  }

  // Desconectar WebSocket al destruir el servicio
  ngOnDestroy() {
    this.desconectarWebSocket();
  }

  // Desconectar WebSocket manualmente
  private desconectarWebSocket() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log('WebSocket desconectado');
      });
    }
  }
}
