export class GeographyModel {
  idgeografia: string;
  codigogeografia: string;
  nombre: string;
  nivel: number;
  status: boolean;
  fkidgeografia: string;
  fechacreacion: Date;
  fechamodificacion: Date;
  belong_name: string;
  action: string;

  constructor() {
    this.idgeografia = '';
    this.codigogeografia = '';
    this.nombre = '';
    this.nivel = 0;
    this.status = true;
    this.fkidgeografia = '';
    this.fechacreacion = new Date();
    this.fechamodificacion = new Date();
    this.belong_name = '';
    this.action = '';
  }
}
