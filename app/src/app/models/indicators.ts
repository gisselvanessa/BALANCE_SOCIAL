export class IndicatorModel {
  idindicador: number; // Cambiado a number
  codigoindicador: string;
  descriptionindicator: string;
  operacion: string;
  status: boolean;
  fechacreacion: Date | null; // Cambiado a Date | null
  fechamodificacion: Date | null; // Cambiado a Date | null
  validezinicio: Date | null; // Cambiado a Date | null
  validezfin: Date | null; // Cambiado a Date | null
  idprincioclasificacione: string;
  idlineamiento: number; // Nuevo campo
  descripcionlineamiento: string; // Nuevo campo
  idcaracteristica: number; // Nuevo campo
  descripcioncaracteristica: string; // Nuevo campo
  idclasificacion: number; // Nuevo campo
  descripcionclasificacion: string; // Nuevo campo
  idprincipio: number; // Nuevo campo
  codigoprincipio: string; // Nuevo campo
  descripcionprincipio: string; // Nuevo campo
  action: string; // Nuevo campo
  numerador: number; // Nuevo campo
  denominador: number; // Nuevo campo
  idvalor_numerador: number; // Nuevo campo
  idvalor_denominador: number; // Nuevo campo
  valor_numerador: string; // Nuevo campo
  valor_denominador: string; // Nuevo campo



  constructor() {
    this.idindicador = 0; // Cambiado a 0
    this.codigoindicador = '';
    this.descriptionindicator = '';
    this.operacion = '';
    this.status = true;
    this.fechacreacion = null;
    this.fechamodificacion = null;
    this.validezinicio = null;
    this.validezfin = null;
    this.idprincioclasificacione = '';
    this.idlineamiento = 0;
    this.descripcionlineamiento = '';
    this.idcaracteristica = 0;
    this.descripcioncaracteristica = '';
    this.idclasificacion = 0;
    this.descripcionclasificacion = '';
    this.idprincipio = 0;
    this.codigoprincipio = '';
    this.descripcionprincipio = '';
    this.action = '';
    this.numerador = 0; // Cambiado a 0
    this.denominador = 0; // Cambiado a 0
    this.idvalor_numerador = 0; // Cambiado a 0
    this.idvalor_denominador = 0; // Cambiado a 0
    this.valor_numerador = '';
    this.valor_denominador = '';


  }
}
