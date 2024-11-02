import { ReaccionDTO } from "./ReaccionDTO";
import { UsuarioDTO } from "./UsuarioDTO";


export interface RespuestaDTO {
    mostrarFormularioRespuesta?: boolean;
    mostrarFormularioEdicion?: boolean;
    mostrarRespuestas?: boolean;
    id?: number;
    mensaje?: string;
    fecha?: string;
    listaRespuesta?: RespuestaDTO[];
    listaReaccion?: ReaccionDTO[];
    usuarioId?:number;
    username?:string;
    editado?: boolean;
}
