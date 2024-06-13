export class DepartmentModel {
  iddepartamento: string;
  codigodepartamento: string;
  nombredepartamento: string;
  descripciondepartamento: string | null;
  status: boolean;
  idsucursal: string;
  fechacreacion: Date;
  fechamodificacion: Date;
  action: string;
  nombresucursal: string;
  idcorporacion?: string;
  nombrecorporacion: string;
  nombregeografia: string;
  nombregeografiacompleto: string;

  constructor() {
      this.iddepartamento = '';
      this.codigodepartamento = '';
      this.nombredepartamento = '';
      this.descripciondepartamento = null;
      this.status = true;
      this.idsucursal =  '';
      this.fechacreacion = new Date();
      this.fechamodificacion = new Date();
      this.action = '';
      this.nombresucursal = '';
      this.idcorporacion = '';
      this.nombrecorporacion = '';
      this.nombregeografia = '';
      this.nombregeografiacompleto = '';
  }
}
