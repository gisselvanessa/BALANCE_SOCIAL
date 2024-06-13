export class RolePrivilegeModel {
    idpagina: string;
    idprivilegio: string;
    idrol: string;
    codigopagina: string;
    descripcionpagina: string | null;

    constructor() {
        this.idpagina = '';
        this.idprivilegio = '';
        this.idrol = '';
        this.codigopagina = '';
        this.descripcionpagina = '';
    }
}
