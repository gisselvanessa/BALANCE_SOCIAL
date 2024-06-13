export class PersonModel {
    idusuario: string;
    tipoidentificacion: string;
    idtipoidentificacion: number;
    codigotipoidentificacion: string;
    identificacion: string;
    first_name: string;
    last_name: string;
    genero: string;
    email: string;
    password: string;
    celular: string | null;
    telefono: string | null;
    direccion: string | null;
    is_active: boolean;
    idrol: string;
    username: string;
    date_register: Date;
    date_modify: Date;
    code_role: string;
    nombrerol: string;
    id_department: string;  // Nueva propiedad añadida
    code_department: string;
    nombredepartamento: string;
    id_branch: string;
    idgenero: string;
    code_branch: string;
    nombresucursal: string;
    id_corporation: string;
    nombrecorporacion: string;
    action: string;

    constructor() {
        this.idusuario = '';
        this.tipoidentificacion = '';
        this.idtipoidentificacion = 0;
        this.codigotipoidentificacion = '';
        this.identificacion = '';
        this.first_name = '';
        this.last_name = '';
        this.genero = '';
        this.email = '';
        this.password = '';
        this.celular = null;
        this.telefono = null;
        this.direccion = null;
        this.is_active = true;
        this.idrol = '';
        this.username = '';
        this.date_register = new Date();
        this.date_modify = new Date();
        this.code_role = '';
        this.nombrerol = '';
        this.id_department = '';  // Inicialización de la nueva propiedad
        this.code_department = '';
        this.nombredepartamento = '';
        this.id_branch = '';
        this.idgenero = '';
        this.code_branch = '';
        this.nombresucursal = '';
        this.id_corporation = '';
        this.nombrecorporacion = '';
        this.action = '';
    }
}
