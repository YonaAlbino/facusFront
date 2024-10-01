import { RefreshToken } from "./refresh-token";
import { Rol } from "./rol";

export interface Usuario {
    id?: number;
    username?: string;
    password?: string;
    enable?:boolean;
    accountNotExpired?: boolean;
    accountNotLocked?: boolean;
    credentialNotExpired?: boolean;
    listaRoles?: Rol[];
    refreshToken?:RefreshToken;
}
