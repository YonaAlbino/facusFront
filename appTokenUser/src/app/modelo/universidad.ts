import { Calificacion } from "./calificacion";
import { Carrera } from "./carrera";
import { Comentario } from "./comentario";

export interface Universidad {
    id?:number;
    nombre?:string;
    imagen?:string;
    direccion?:string;
    descripcion?:string;
    direccionWeb?:string;
    listaCarreras?:Carrera[];
    listaCalificacion?:Calificacion[];
    listaComentarios?:Comentario[];
}
