export class ObjectiveModel {
    idobjectivo: number;
    codigoindicador: string;
    meta: string;
    objetivo: string;
    status: boolean;
    validezinicio: Date;
    validezfin: Date | null;
    objetivo_validezinicio: Date | null;
    idindicador: number;
    operacion: string;
    relacionproporcion: string;
    aplica: boolean;
    action: string;
    logica: string | null;
    data_dialog: boolean;
    isAverage:boolean;

    // Nuevos campos agregados
    descripcionindicador: string;
    variables: string[];
    idvalor_denominador: number;
    valor_denominador: string;
    idvalor_numerador: number;
    valor_numerador: string;
    is_applicable: boolean;
    fechacreacion: Date | null;
    fechamodificacion: Date | null;
    idlineamiento: number;
    descripcionlineamiento: string;
    idcaracteristica: number;
    descripcioncaracteristica: string;
    idclasificacion: number;
    descripcionclasificacion: string;
    idprincipio: number;
    codigoprincipio: string;
    descripcionprincipio: string;

    constructor() {
        this.idobjectivo = 0;
        this.codigoindicador = '';
        this.meta = '';
        this.objetivo = '';
        this.relacionproporcion = '';
        this.status = false;
        this.isAverage = false;
        this.validezinicio = new Date();
        this.objetivo_validezinicio = new Date();
        this.validezfin = null;
        this.idindicador = 0;
        this.operacion = '';
        this.action = '';
        this.aplica = true;
        this.data_dialog = true;

        // Inicialización de nuevos campos
        this.descripcionindicador = '';
        this.variables = [];
        this.idvalor_denominador = 0;
        this.valor_denominador = '';
        this.idvalor_numerador = 0;
        this.valor_numerador = '';
        this.is_applicable = false;
        this.fechacreacion = null;
        this.fechamodificacion = null;
        this.idlineamiento = 0;
        this.descripcionlineamiento = '';
        this.idcaracteristica = 0;
        this.descripcioncaracteristica = '';
        this.idclasificacion = 0;
        this.descripcionclasificacion = '';
        this.idprincipio = 0;
        this.codigoprincipio = '';
        this.descripcionprincipio = '';
        this.logica = '';
    }
}
