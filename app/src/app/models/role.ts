export class RoleModel {
    idrol: string;
    // codigorol: string;
    nombrerol: string;
    descripcionrol: string;
    status: boolean;
    fechacreacion: Date;
    fechamodificacion: Date;
    iddepartamento: string;
    active: boolean;
    action: string;
    nombredepartamento: string; // Campo adicional
    idsucursal: string; // Campo adicional
    nombresucursal: string; // Campo adicional
    idcorporacion: string; // Campo adicional
    nombrecorporacion: string; // Campo adicional

    constructor() {
        this.idrol = '';
        // this.codigorol = '';
        this.nombrerol = '';
        this.descripcionrol = '';
        this.status = true;
        this.iddepartamento = '';
        this.fechacreacion = new Date();
        this.fechamodificacion = new Date();
        this.active = false;
        this.action = '';
        this.nombredepartamento = ''; // Inicialización del campo adicional
        this.idsucursal = ''; // Inicialización del campo adicional
        this.nombresucursal = ''; // Inicialización del campo adicional
        this.idcorporacion = ''; // Inicialización del campo adicional
        this.nombrecorporacion = ''; // Inicialización del campo adicional
    }
}

