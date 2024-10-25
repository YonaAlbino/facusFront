import { UsuarioDTO } from "./UsuarioDTO";
import { UsuarioLeidoDTO } from "./UsuarioLeidoDTO";

export interface NotificacionDTO {
    id?: number;
    informacion?: string;
    idRedireccionamiento?: number;
    leida?: boolean;
    listaUsuarios?: UsuarioDTO[];
    listaDeusuariosLeidos?: UsuarioLeidoDTO[];
}
