import { Reaccion } from "./reaccion";
import { Usuario } from "./usuario";

export interface Comentario {
  id?: number;
  fecha?: string;  // Cambiado a opcional
  mensaje?: string;  // Cambiado a opcional
  listaReaccion?: Reaccion[];
  listaComentario?: Comentario[];
  usuario?: Usuario;  // Cambiado a opcional
}
