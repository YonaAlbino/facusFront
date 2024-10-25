import { ReaccionDTO } from './ReaccionDTO';
import { RespuestaDTO } from './RespuestaDTO';
import { UsuarioDTO } from './UsuarioDTO';

export interface ComentarioDTO {
    id?: number;
    mostrarFormularioEdicion?: boolean;
    mostrarFormularioRespuesta?: boolean;
    usuario?:UsuarioDTO;
    fecha?: string;
    mostrarRespuestas?:boolean;
    mensaje?: string;
    listaReaccion?: ReaccionDTO[];
    listaRespuesta?: RespuestaDTO[];
}
