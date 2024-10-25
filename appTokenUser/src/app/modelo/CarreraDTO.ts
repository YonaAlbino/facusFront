
import { CalificacionDTO } from './calificacion';
import { ComentarioDTO } from './ComentarioDTO';

export interface CarreraDTO {
    id?: number;
    nombre?: string;
    grado?: string;
    duracion?: string;
    activa?: boolean;
    listaComentario?: ComentarioDTO[];
    listaCalificacion?: CalificacionDTO[];
}
