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
  private topics: string[] = [];
  private messageSubjects: { [topic: string]: Subject<string> } = {}; 
  private connectionState = new BehaviorSubject<boolean>(false); // Estado de conexión  
  private idUsuario:number | undefined;
  private readonly WEBSOCKET_URL = "http://localhost:8080/websocket"; 

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
    });
  }

  private capturarTopics(rolUsuario: string) {
    this.topics = []; // Limpiar la lista de topics previos
    if (rolUsuario === 'ROLE_ADMIN') {
      this.topics.push('/tema/admin/notificacion');
      this.topics.push('/tema/usuario/' + this.idUsuario);
    } else if (rolUsuario === 'ROLE_USER') {
      this.topics.push('/tema/usuario/notificacion');
      this.topics.push('/tema/usuario/' + this.idUsuario);
    }

    // Crear un `Subject` para cada topic
    this.topics.forEach(topic => {
      this.messageSubjects[topic] = new Subject<string>();
    });
  }

  // Iniciar conexión WebSocket y esperar hasta que esté conectada
  public iniciarConexionSocket(rolUsuario: string) {
    this.capturarTopics(rolUsuario);  // Actualiza los topics basados en el rol
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

  private suscribirseATopics() {
    if (this.stompClient?.connected) {
      this.topics.forEach(topic => {
        this.suscribirseAlTopic(topic);
      });
    } else {
      console.error('No se puede suscribir a los topics, WebSocket no está conectado');
    }
  }

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

  private reSuscribirseAlTopic(intentos: number, topic: string) {
    if (intentos < this.maxIntentosSubscribicionToken) {
      this.intentosSubscribicionTopic++;
      const delay = Math.min(3000 * Math.pow(2, intentos), 60000); 
      setTimeout(() => {
        this.suscribirseAlTopic(topic);
      }, delay);
    } else {
      console.error(`Número máximo de intentos de suscripción alcanzado para el topic ${topic}`);
    }
  }

  private reconectarWebSocket(rolUsuario: string) {
    setTimeout(() => {
      console.log('Intentando reconectar WebSocket...');
      this.iniciarConexionSocket(rolUsuario);
    }, 5000); // Intentar reconectar en 5 segundos
  }

  // Método para escuchar los mensajes después de que la conexión se haya establecido
  public getMessages(topic: string) {
    return this.messageSubjects[topic]?.asObservable(); 
  }

  // Obtener el estado de conexión
  public getConnectionState() {
    return this.connectionState.asObservable();
  }

  ngOnDestroy() {
    this.desconectarWebSocket();
  }

  private desconectarWebSocket() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log('WebSocket desconectado');
      });
    }
  }
}
