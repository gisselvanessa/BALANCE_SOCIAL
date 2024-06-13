export class GenderModel {
    idgenero: string;
    codigogenero: string;
    descripciongenero: string;
    status: boolean;
    fechacreacion: Date;
    fechamodificacion: Date;
    belong: string;
    action: string;
  
    constructor() {
      this.idgenero = '';
      this.codigogenero = '';
      this.descripciongenero = '';
      this.status = true;
      this.fechacreacion = new Date();
      this.fechamodificacion = new Date();
      this.belong = '';
      this.action = '';
    }
  }
  