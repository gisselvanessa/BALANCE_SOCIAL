export class CorporationModel {

    idcorporacion?: number;
    nombrecorporacion: string;
    descripcioncorporacion: string | null;
    representantelegal: string | null;
    ruc: string | null;
    direccioncorporacion: string | null;
    telefonocorporacion: string | null;
    status: boolean | null;
    fechacreacion: Date | null;
    fechamodificacion?: Date | null;
    ipcreacion: string | null;
    ipmodificacion: string | null;
    idgeografia: string | null;
    belong: string;
    value: string;
    action: string;

    constructor() {
      this.idcorporacion = 0;
      this.nombrecorporacion = '';
      this.descripcioncorporacion = null;
      this.representantelegal = null;
      this.ruc = null;
      this.direccioncorporacion = null;
      this.telefonocorporacion = null;
      this.status = true;
      this.fechacreacion = new Date();
      this.idgeografia = '';
      this.fechamodificacion = new Date();
      this.belong = '';
      this.value = '';
      this.action = '';
    }
  }


