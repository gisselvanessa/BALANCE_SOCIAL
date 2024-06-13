export class PrincipleModel {
    idprincipio: string;
    codigoprincipio: string;
    descripcionprincipio: string;
    status: boolean;
    fechacreacion: Date;
    fechamodificacion: Date;
    action: string;
    validezinicio: string;
    validezfin: string;
  
    constructor() {
      this.idprincipio = '';
      this.codigoprincipio = '';
      this.descripcionprincipio = '';
      this.status = true;
      this.fechacreacion = new Date();
      this.fechamodificacion = new Date();
      this.action = '';
      this.validezinicio = '';
      this.validezfin = '';
    }
  }