export class ObjectiveValueModel {
    idobjetivevalue: number;
    resultado: string;
    cumplimiento: boolean;
    status: boolean;
    fechacreacion: Date;
    fechamodificacion: Date;
    idobjectivo: number;
    idnumerador: number;
    iddenominador: number;
    idusuario: number;

    constructor() {
        this.idobjetivevalue = 0;
        this.resultado = '';
        this.cumplimiento = false;
        this.status = false;
        this.fechacreacion = new Date();
        this.fechamodificacion = new Date();
        this.idobjectivo = 0;
        this.idnumerador = 0;
        this.iddenominador = 0;
        this.idusuario = 0;
    }
}
