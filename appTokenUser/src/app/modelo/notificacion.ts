import { Usuario } from "./usuario";

export interface Notificacion {
    id?: number;
    informacion?: string;
    idRedireccionamiento?: number;
    listaUsuarios?: Usuario[]; 
    leida?:boolean;
}
