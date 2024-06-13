export class BranchModel {
    idsucursal?: string;
    codigosucursal: string;
    nombresucursal: string;
    descripcionsucursal: string | null;
    direccionsucursal: string | null;
    telefonosucursal: string | null;
    status: boolean | null;
    idcorporacion: string;
    idgeografia: string;
    fechacreacion?: Date;
    fechamodificacion?: Date;
    belong: string;
    action: string;

    constructor() {
        this.idsucursal ='';
        this.codigosucursal = '';
        this.nombresucursal = '';
        this.descripcionsucursal = null;
        this.direccionsucursal =  null;
        this.telefonosucursal =  null;
        this.status =  true;
        this.idcorporacion = '';
        this.idgeografia =  '';
        this.fechacreacion =   new Date();
        this.fechamodificacion =  new Date();
        this.belong = '';
        this.action = '';
    }
}
