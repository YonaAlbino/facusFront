import { Calificacion } from "./calificacion";
import { Comentario } from "./comentario";
import { Reaccion } from "./reaccion";
import { RefreshToken } from "./refresh-token";
import { Rol } from "./rol";
import { Universidad } from "./universidad";

export interface Usuario {
    id?: number;
    username?: string;
    password?: string;
    enable?:boolean;
    accountNotExpired?: boolean;
    accountNotLocked?: boolean;
    credentialNotExpired?: boolean;
    listaRoles?: Rol[];
    listaUniversidad?: Universidad[];
    listaCalificacion?: Calificacion[];
    listaComentarios?: Comentario[];
    listaReaccion?: Reaccion[];
    refreshToken?:RefreshToken;
}
