import { Component, Inject, Optional, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MessagesPopups } from "@app/helpers/messagesPopups";
import { Router } from '@angular/router';
import { IndicatorModel } from '@app/models/indicators';
import { FormControl } from '@angular/forms';
import { IndicatorService } from '@app/services/indicator.service';
import { ValuesService } from '@app/services/values.service';
import { ValuesModel } from '@app/models/values';
import { ObjectiveModel } from '@app/models/objective';
import { ObjectiveService } from '@app/services/objective.service';
import { firstValueFrom } from 'rxjs';
import { ObjectiveValuesService } from '@app/services/objective-values.service';
import { LoginService } from '@app/services/login.service';
import { ReportsValobjService } from '@app/services/reports-valobj.service';
import { ShareDataService } from '@app/services/share-data.service';


@Component({
  selector: 'app-principle7',
  templateUrl: './principle7.component.html',
  styleUrls: ['./principle7.component.scss']
})
export class Principle7Component {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  loading: boolean = false;
  local_data: any;
  local_data_values: any = {};
  local_data_updatevalues: any = {};
  local_data_objetivo: any = {};
  local_data_objetivoValores: any = {};
  showTooltip: boolean = false;
  _indicatorModel: IndicatorModel = new IndicatorModel();
  _objectiveModel: ObjectiveModel = new ObjectiveModel();
  indicatorData: IndicatorModel[];
  objectiveData: ObjectiveModel[];
  principleControl = new FormControl();
  denominadorFilled: boolean = false;
  idUsuario: any;
  principle_title: string = '';
  objetivevalsArray: any = [];
  idReporte: number;
  reportObject: any = {};
  counterObjArray: number=0;
  counter: number =0;
  incomplete_indicators: any = [];
  sharedValue: number;
  enterPressed:boolean = false;

  displayedColumns: string[] = [
    'is_complete',
    'codigoindicador',
    // 'descripcioncaracteristica',
    'descripcionindicador',
    'value1',
    'valor_numerador',
    'value2',
    'valor_denominador',
    'status',
    'action',
  ];


  dataSource = new MatTableDataSource<any>;
  // dataSource = new MatTableDataSource<IndicatorModel>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public indicatorService: IndicatorService,
    public objectiveService: ObjectiveService,
    public objetiveValueService: ObjectiveValuesService,
    public valuesService: ValuesService,
    public messagesPopups: MessagesPopups,
    private loginService: LoginService,
    public reportsValService: ReportsValobjService,
    private shareDataService: ShareDataService,


    public route: Router
  ) {
    this.dataSource = new MatTableDataSource<any>();
    const user = this.loginService.userValue;
    this.idUsuario = user?.idusuario;


  }
  // 3 accordian
  step: any;
  currentstep = 1;



  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
    this.currentstep++;

  }

  prevStep() {
    this.step--;
    this.currentstep--;

  }
  panelOpenState = false;

  async ngOnInit(): Promise<void> {
    await this.getDataInfo(this.currentPage, this.pageSize);

    this.shareDataService.getSharedValue().subscribe(value => {
      this.sharedValue = value;
    });
    this.sharedValue ? this.setStep(this.sharedValue) : this.setStep(this.local_data[0].idclasificacion);
    this.principle_title = this.local_data[0].data[0].descripcionprincipio;
    this.idReporte = this.local_data[0].data[0].idreporte;

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  onInputValue1(event: any, element: any) {
     
    event.target.value = event.target.value.replace(/[^0-9.]/g, '');
    element.numeradorFilled = event.target.value.trim().length > 0;
  }

  onInputValue2(event: any, element: any) {
     
    event.target.value = event.target.value.replace(/[^0-9.]/g, '');
    element.denominadorFilled = event.target.value.trim().length > 0;
  }
  onInputValueText(event: any, element: any) {
     
    element.numeradorFilled = event.target.value.trim().length > 0;
  }
  onChange(element: any) {
    if (element.selection !== element.valor_numerador) {

      element.denominadorFilled = true;
    }
    else {
      element.denominadorFilled = false;

    }

  }

  async getDataInfo(page: number, pageSize: number): Promise<void> {
    try {
      this.loading = true
      const data: any = await this.indicatorService.getDataById('7', this.searchText).toPromise();

      if (data.message == 'success') {
        this.totalCount = data.data.totalCount;
        this.local_data = data.data;
        this.dataSource.data = data.data;
        this.loading = false
      } else {
        this.messagesPopups.popupMessage('Error: ' + data.message);
        this.loading = false
      }
    } catch (error) {
      this.messagesPopups.popupMessage('Error al obtener datos: ' + error);
      console.error('Error al obtener datos:', error);
      this.loading = false
    }
  }

  applyFilter(): void {
    this.getDataInfo(1, this.pageSize);
  }


  onPageChanged(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    this.getDataInfo(this.currentPage, this.pageSize);
  }

  openDialogCreate(): void {
    this.route.navigate(['/admin/indicator-create']);
  }


  resetearValor(element: any, type: string) {
    if (type === 'numerador') {
      element.numerador = null; // o puedes asignar undefined
    }
    if (type === 'denominador') {
      element.denominador = null; // o puedes asignar undefined
    }
    if (type === 'selection') {
      element.selection = null;
    }
  }

  async generateResults(element: any) {
    this.local_data_objetivoValores = {};
    let missingFields: any[] = [];

    const checkAndAssignField = (field: string, value: any, alias: string) => {
      if (!value) {
        missingFields.push(alias);
      } else {
        this.local_data_objetivoValores[field] = value;
      }
    };

    if (element.is_applicable === true) {
      checkAndAssignField('idobjectivo', element.idobjectivo, 'Objetivo');
      checkAndAssignField('idnumerador', element.idvalor_numerador, 'Numerador');

      if (element.operacion === 'División' || element.operacion === 'División - 1') {
        checkAndAssignField('iddenominador', element.idvalor_denominador, 'Denominador');
      }

      this.local_data_objetivoValores.idusuario = this.idUsuario;
      this.local_data_objetivoValores.idobjetivevalue = element.idobjetivevalue;
      this.local_data_objetivoValores.is_average = element.relacionproporcion==="Porcentaje"? false : true;
      this.local_data_objetivoValores.is_applicable = element.is_applicable;

    } else {
      checkAndAssignField('idobjectivo', element.idobjectivo, 'Objetivo');
      this.local_data_objetivoValores.idusuario = this.idUsuario;
      this.local_data_objetivoValores.idobjetivevalue = element.idobjetivevalue;
      this.local_data_objetivoValores.is_average = element.relacionproporcion==="Porcentaje"? false : true;
      this.local_data_objetivoValores.is_applicable = element.is_applicable;
    }

    if (missingFields.length > 0) {
      this.messagesPopups.popupMessage(`Campos vacíos: ${missingFields.join(', ')}`);
    } else {
      this.createObjetiveValue(this.local_data_objetivoValores, element.operacion);
    }
  }

  private createObjetiveValue(objetivoValores: any, operacion: string) {
    if(!objetivoValores.idobjetivevalue){

      this.objetiveValueService.create(objetivoValores).subscribe(
        (data: any) => {
          if (data.message == 'success') {
            this.local_data_objetivoValores = {};
  
            this.messagesPopups.popupMessage(data.message);
  
            if (objetivoValores.is_applicable && data.data) {
  
              this.handleApplicableRoutes(operacion, data.data, objetivoValores.is_average);
            }
            else {
              this.getDataInfo(this.currentPage, this.pageSize);
            }
  
          } else {
            this.messagesPopups.popupMessage('Error: ' + data.message);
          }
        },
        (error) => {
  
          this.messagesPopups.popupMessage(error);
          console.error('Error al obtener datos:', error);
          if (objetivoValores.is_applicable) {
            this.handleApplicableRoutes(operacion, objetivoValores, objetivoValores.is_average);
          }
          else {
            this.getDataInfo(this.currentPage, this.pageSize);
          }
        }
      );
    }
    else{
      if (objetivoValores.is_applicable) {
        this.handleApplicableRoutes(operacion, objetivoValores, objetivoValores.is_average);
      }
    }
  }

  private handleApplicableRoutes(operacion: string, objetivevalue: any, average: boolean) {

    if (objetivevalue) {
      if ((operacion === 'División' || operacion === 'División - 1') && !average) {
        this.route.navigate([`/report/results/${objetivevalue.idobjetivevalue}`]);
      } else if (operacion === 'Cumplimiento' || operacion === 'Igual') {
        this.route.navigate([`/report/results-ic/${objetivevalue.idobjetivevalue}`]);
      } else if ((operacion === 'División' || operacion === 'División - 1') && average) {
        this.route.navigate([`/report/results-p/${objetivevalue.idobjetivevalue}`]);
      } else if (operacion === 'Texto' || operacion === 'Selección') {
        this.route.navigate([`/report/results-ic/${objetivevalue.idobjetivevalue}`]);
      }
    }
  }

  onEnterPressed(element: any) {

    if (!this.enterPressed) {
      this.saveValues(element);
      // Marcar que Enter ha sido presionado
      this.enterPressed = true;
      // Reiniciar la variable después de un tiempo determinado (por ejemplo, 1 segundo)
      setTimeout(() => {
          this.enterPressed = false;
      }, 2000); 
  }
}

  async validateElement(element: any): Promise<string | null> {
    if (element.operacion === 'División' || element.operacion === 'División - 1') {
      if (element.numerador && element.denominador) {
        if (Number(element.numerador) > Number(element.denominador)) {
          return 'El valor del numerador es mayor que el valor del denominador';
        }
      }
      if (element.numerador && !element.denominador && element.valor_denominador) {
        if (Number(element.numerador) > Number(element.valor_denominador)) {
          return 'El valor del numerador es mayor que el valor del denominador';
        }
      }
      if (element.denominador && !element.numerador && element.valor_numerador) {
        if (Number(element.valor_numerador) > Number(element.denominador)) {
          return 'El valor del numerador es mayor que el valor del denominador';
        }
      }
    }

    return null; // Retorna null si todas las validaciones pasan
  }


  async saveValues(element: any) {

    try {
      if (element.operacion === 'División' || element.operacion === 'División - 1') {

        if(element.relacionproporcion==='Porcentaje'){
          const validationMessage = await this.validateElement(element);

          if (validationMessage) {
            this.messagesPopups.popupMessage(validationMessage);
            return;
          }
        }
        
        if (element.numerador) {
          await this.saveValue(element.numerador, element.variables[0], 'number', element, 'numerador', element.idvalor_numerador);

        }
        else if (!element.numerador && !element.idvalor_numerador){
          this.messagesPopups.popupMessage('Campo vacío: Numerador');
        }
        if (element.denominador) {
          await this.saveValue(element.denominador, element.variables[1], 'number', element, 'denominador', element.idvalor_denominador);
        }
        else if (!element.denominador && !element.idvalor_denominador){
          this.messagesPopups.popupMessage('Campo vacío: Denominador');
        }

      } else if (element.operacion === "Cumplimiento") {


        if (element.selection) {
          await this.saveValue(element.selection, element.variables[0], 'boolean', element, 'selection', element.idvalor_numerador);

        }
        else if (!element.selection && !element.idvalor_numerador){
          this.messagesPopups.popupMessage('Campo vacío: Numerador');
        }

      } else if (element.operacion === 'Texto' || element.operacion === "Selección") {


        if (element.numerador) {
          await this.saveValue(element.numerador, element.variables[0], 'string', element, 'numerador', element.idvalor_numerador);

        }
        else if (!element.numerador && !element.idvalor_numerador) {
          this.messagesPopups.popupMessage('Campo vacío: Numerador');
        }
      }
      else if (element.operacion === "Igual") {

        if (element.numerador) {
          await this.saveValue(element.numerador, element.variables[0], 'number', element, 'numerador', element.idvalor_numerador);

        }
        else if (!element.numerador && !element.idvalor_numerador){
          this.messagesPopups.popupMessage('Campo vacío: Numerador');
        }
      }

    } catch (error) {
      console.error('Error in saveValues:', error);
    }
  }

  async saveValue(valor: any, descripcionvalores: any, tipovalor: string, element: any, type: string, id: any) {
    
    try {
      if(element.operacion === 'División' || element.operacion === 'División - 1' || element.operacion === "Igual"){
        const isNumberValid = /^(\d+|\d+\.\d{1,4})$/.test(valor);
    
        if (!isNumberValid) {
          this.messagesPopups.popupMessage(`El ${type} no es válido.`);
          return;
        }
      }
     
      this.local_data_values.valor = valor;
      this.local_data_values.descripcionvalores = descripcionvalores;
      this.local_data_values.tipovalor = tipovalor;


      const createResponse = await this.valuesService.create(this.local_data_values).toPromise();
      this.handleApiResponse(createResponse, element, type);
    } catch (error) {
      console.error('Error in saveValue:', error);
      this.messagesPopups.popupMessage('Error al obtener datos: ' + error);
    }
  }


  private handleApiResponse(data: any, element: any, type: string) {
    element.saveValuesButton = true;
    if (data) {
      this.local_data_values = {};
      this.messagesPopups.popupMessage('success');

      this.resetearValor(element, type); // Llamar a resetearValor solo si el mensaje es 'success'
      this.getDataInfo(this.currentPage, this.pageSize);

    } else {
      this.messagesPopups.popupMessage('Error: ' + data.message);
    }
  }
  private handleError(error: any) {
    this.messagesPopups.popupMessage('Error al obtener datos: ' + error);
    console.error('Error al obtener datos:', error);
  }


  viewPage(id: any) {
    this.route.navigate([`/admin/indicator-view/${id}`]);

  }

  editPage(id: any) {
    this.route.navigate([`/admin/indicator-edit/${id}`]);

  }
  async saveAims(element: any) {

    try {
      if ((element.objetivo || element.operacion === 'Cumplimiento') && element.idobjectivo) {
        await this.updateAim(element.idobjectivo, element);

      }

      if (element.objetivo || element.operacion === 'Cumplimiento') {

        await this.saveAim(element);

      }

    } catch (error) {
      console.error('Error in saveValues:', error);
    }
  }
  async updateAim(id: any, element: any) {
    try {
      this.local_data_objetivo.idobjectivo = id;
      this.local_data_objetivo.status = false;
      this.local_data_objetivo.validezfin = new Date();

      const updateResponse: any = await this.objectiveService.update(this.local_data_objetivo).toPromise();

      if (updateResponse.message === 'success') {
        this.local_data_objetivo = {};
        this.messagesPopups.popupMessage(updateResponse.message);
        // this.ngOnInit();
        this.getDataInfo(this.currentPage, this.pageSize);


      } else {
        this.messagesPopups.popupMessage('Error: ' + updateResponse.message);
      }
    } catch (error) {
      console.error('Error in updateValue:', error);
      this.messagesPopups.popupMessage('Error al obtener datos actualizando: ' + error);
    }
  }
  // tslint:disable-next-line - Disables all
  saveAim(row_obj: any): boolean | any {
   
    this.local_data_objetivo.meta = row_obj.objetivo;
    this.local_data_objetivo.idindicador = row_obj.idindicador;
    this.local_data_objetivo.is_applicable = row_obj.aplica;
    this.local_data_objetivo.logica = row_obj.logica;
    this.local_data_objetivo.status = true;
  
    this.objectiveService.create(this.local_data_objetivo).subscribe(
      data => {
        if (data.message == 'success') {
          this._objectiveModel = new ObjectiveModel();
          // this.ngOnInit();
          this.getDataInfo(this.currentPage, this.pageSize);

          this.messagesPopups.popupMessage(data.message);
        } else {
          this.openDialog(row_obj.event, row_obj);

          this.messagesPopups.popupMessage('Error: ' + data.message);
        }
      },
      (error) => {
        this.messagesPopups.popupMessage('Error al obtener datos: ' + error);
        console.error('Error al obtener datos:', error);
      }
    );
  }

  refreshPage() {
    this.ngOnInit();

  }

  openDialog(action: string, obj: ObjectiveModel): void {

    // if (obj.operacion !== "Cumplimiento") {
    obj.action = action;

    const dialogRef = this.dialog.open(DialogPrinciple7Component, {
      data: {
        param1: obj,
        param2: this.objectiveData
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

        if (result.event === 'Save') {
          this.saveAims(result.data);
        }
      };
    });
    // }
  }
  saveReport() {
    this.loading = true;

    // Itera sobre cada propiedad en local_data
    Object.values(this.local_data).forEach((item: any) => {
      // Itera sobre cada elemento en el array de datos de cada propiedad
      this.counter = this.counter+ item.data.length;
    

      item.data.forEach((dataItem: any) => {
        if (dataItem.is_complete) {
          this.objetivevalsArray.push(dataItem.idobjetivevalue)

        }
        else{
          this.incomplete_indicators.push(dataItem.codigoindicador)
        }
      });
      this.counterObjArray = this.objetivevalsArray.length;
    });
    if(this.counter === this.counterObjArray){
      this.reportObject={
        report: this.local_data[0].data[0].idreporte,
        objetivevals: this.objetivevalsArray,
        principlecode: this.local_data[0].data[0].codigoprincipio
      }
      this.reportsValService.create(this.reportObject).subscribe(
        (data:any) => {
          // if (data) {
          if (data) {
            this.messagesPopups.popupMessage(data.message);
            // this.route.navigate([`/report/principles-list/${this.idReporte}`]);
            this.route.navigate([`/report/report-list`]);

          } else {
            // this.messagesPopups.popupMessage('Error: ');
            this.messagesPopups.popupMessage('Error: ' + data.message);
          }
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.messagesPopups.popupMessage('Error al obtener datos: ' + error);
          console.error('Error al obtener datos:', error);
        }
      );
    }
    else{
      this.loading = false;

      this.messagesPopups.popupMessage('Completar los indicadores: '+ this.incomplete_indicators);
      this.incomplete_indicators = [];
      this.counter = 0;
      this.counterObjArray = 0;
    }
  }
  backPrincipleList() {
    this.shareDataService.setSharedValue(0);
    // this.route.navigate([`/report/principles-list/${this.idReporte}`]);
    this.route.navigate([`/report/report-list`]);

  }

}
//Dialog Component
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-principle7',
  templateUrl: './dialog-principle7.html'
})
// tslint:disable-next-line: component-class-suffix
export class DialogPrinciple7Component implements OnInit {
  action: string;
  local_data_objective: ObjectiveModel;
  showDialog: boolean = true;
  toogleGoal: string = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<DialogPrinciple7Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.local_data_objective = data.param1;
    this.local_data_objective.validezinicio = new Date();
    this.local_data_objective.aplica = data.param1.is_applicable ? data.param1.is_applicable : false;
    this.toogleGoal = data.param1.logica;
    this.action = this.local_data_objective.action;
    this.local_data_objective.isAverage = data.param1.relacionproporcion === "Porcentaje" ? false : data.param1.relacionproporcion === "Promedio_Procentaje" ? false:true;

    if (
      this.local_data_objective.operacion === 'Cumplimiento' ||
      this.local_data_objective.operacion === 'Texto' ||
      this.local_data_objective.operacion === 'Selección'
    ) {
      this.local_data_objective.logica = null;

    } else {
      this.local_data_objective.logica = this.toogleGoal ;

    }
  }

  async ngOnInit(): Promise<void> {

  }
  onInputValueAim(event: any) {
     
    event.target.value = event.target.value.replace(/[^0-9.]/g, '');
  }

  onInputValueAimDiv(event: any) {
    // Eliminar caracteres no permitidos (letras y otros)
    event.target.value = event.target.value.replace(/[^0-9.]/g, '');

  }


  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data_objective });
    
    this.local_data_objective = new ObjectiveModel;

  }
  toggleChanged() {
    // Aquí puedes realizar acciones cuando el toggle cambie
    if (!this.local_data_objective.aplica) {
      this.local_data_objective.objetivo = 'N/A'
    }
    else {
      this.local_data_objective.objetivo = ''
    }
  }

  toggleChangedSetGoal() {
    // Aquí puedes realizar acciones cuando el toggle cambie
    if (this.toogleGoal === 'greater_than') {
      this.local_data_objective.logica = 'greater_than'
    }
    else if (this.toogleGoal === 'equal_greater_than') {
      this.local_data_objective.logica = 'equal_greater_than'
    }
    else if (this.toogleGoal === 'equal') {
      this.local_data_objective.logica = 'equal'
    }
    else if (this.toogleGoal === 'equal_less_than') {
      this.local_data_objective.logica = 'equal_less_than'
    }
    else if (this.toogleGoal === 'less_than') {
      this.local_data_objective.logica = 'less_than'
    }
   
  }
  closeDialog(): void {
    this.dialogRef.close();
    this.showDialog = false;
    this.local_data_objective = new ObjectiveModel();
    this.local_data_objective.objetivo = ''; // También puedes restablecer específicamente la propiedad objetivo

  }
}