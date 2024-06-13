export class ValuesModel {
    idvalores: number;
    descripcionvalores: string;
    tipovalor: string;
    valor: string;
    status:boolean;
    validezinicio: Date;
    validezfin: Date;
    numerador: string;
    denominador: string;

  
    constructor() {
        this.idvalores = 0;
      this.descripcionvalores = '';
      this.tipovalor = '';
      this.valor = '';
      this.status = false;
      this.validezinicio= new Date();
      this.validezfin= new Date();
      this.numerador = '';
      this.denominador = '';

    }
  }