
import { CalificacionDTO } from "./calificacion";
import { ComentarioDTO } from "./ComentarioDTO";
import { ReaccionDTO } from "./ReaccionDTO";
import { RefreshTokenDTO } from "./RefreshTokenDTO";
import { RespuestaDTO } from "./RespuestaDTO";
import { RolDTO } from "./RolDTO";
import { UniversidadDTO } from "./UniversidadDTO";


export interface UsuarioDTO {
    id?: number;
    username?: string;
    password?: string;
    enable?: boolean;
    accountNotExpired?: boolean;
    accountNotLocked?: boolean;
    credentialNotExpired?: boolean;
    refreshToken?: RefreshTokenDTO;
    listaRoles?: RolDTO[];
    listaUniversidad?: UniversidadDTO[];
    listaCalificacion?: CalificacionDTO[];
    listaComentarios?: ComentarioDTO[];
    listaRespuesta?: RespuestaDTO[];
    listaReaccion?: ReaccionDTO[];
    numeroInfracciones?:number;
    emailVerified?:boolean;
    imagen?:string;
}
