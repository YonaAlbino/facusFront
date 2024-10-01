import { Calificacion } from "./calificacion";
import { Comentario } from "./comentario";

export interface Carrera {
    id?:number;
    nombre?:string;
    grado?:string;
    duracion?:string;
    activa?:boolean;
    listaComentarios?:Comentario[];
    listaCalificacion?:Calificacion[];
}
