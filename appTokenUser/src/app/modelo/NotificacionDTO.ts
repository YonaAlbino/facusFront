import { UsuarioDTO } from "./UsuarioDTO";
import { UsuarioLeidoDTO } from "./UsuarioLeidoDTO";

export interface NotificacionDTO {
    id?: number;
    informacion?: string;
    idRedireccionamiento?: number;
    leida?: boolean;
    listaUsuarios?: UsuarioDTO[];
    listaDeusuariosLeidos?: UsuarioLeidoDTO[];
    carrera?:boolean;
    comentario?:boolean;
    usuario?:boolean;
    universidad?:boolean;
    permiso?:boolean;
    respuesta?:boolean;

}
