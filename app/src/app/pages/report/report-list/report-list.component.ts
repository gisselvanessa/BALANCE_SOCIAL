import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MessagesPopups } from '@app/helpers/messagesPopups';
import { LoginService } from '@app/services/login.service';
import { PrinciplesService } from '@app/services/principles.service';
import { ReportsService } from '@app/services/reports.service';
import { ShareDataService } from '@app/services/share-data.service';
import { environment } from '@environments/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  idReport: number = 0;
  loading: boolean = false;
  idUsuario: any;
  local_data_Report: any = {};
  local_data: any = {};
  local_data_Principles: any = [];
  local_dummy_report: any = {}
  principlesArray: any = [];
  incomplete_principles: any = [];
  complete_principles: any = [];
  counterObjArray: number = 0;
  counter: number = 0;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    private router: Router,
    public messagesPopups: MessagesPopups,
    public dialog: MatDialog,
    private loginService: LoginService,
    public reportsService: ReportsService,
    public principlesService: PrinciplesService,
    private shareDataService: ShareDataService


  ) {
    const user = this.loginService.userValue;
    this.idUsuario = user?.idusuario;
    this.local_dummy_report = {
      autor: this.idUsuario,
    }
  }
  async ngOnInit(): Promise<void> {
    try {
      this.loading = true;
      this.shareDataService.setSharedValue(0);

      const reportResponse: any = await this.getActiveReport();
      if (reportResponse) {
        this.local_data = reportResponse.data[0];
        await this.getDataInfo(this.currentPage, this.pageSize, this.local_data.idreporte);

      } else {
        this.save(this.local_dummy_report); //Create new report

      }
    } catch (error) {
      this.save(this.local_dummy_report);

    }
  }

  async getActiveReport(): Promise<any> {
    try {
      const reportResponse: any = await firstValueFrom(this.reportsService.getData());
      return reportResponse;
    } catch (error) {
      console.error("Error occurred while fetching active report:", error);
      this.messagesPopups.popupMessage('Error occurred while fetching active report');

      throw error;
    }
  }
  save(row_obj: any): void {
    this.loading = true;
    this.reportsService.create(row_obj).subscribe(
      (data: any) => {
        if (data.message == 'success') {
          this.local_data = data.data;
          this.getDataInfo(this.currentPage, this.pageSize, this.local_data.idreporte); // Llamada a getDataInfo aquí
        } else {
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

  getDataInfo(page: number, pageSize: number, idReport: any) {

    this.principlesService.getAllData(page, pageSize, this.searchText, idReport).subscribe(
      (data: any) => {

        if (data) {
          this.totalCount = data.totalCount;
          // this.dataSource.data = data.results;
          this.local_data_Principles = data.results

          this.local_data_Principles.forEach((item: any) => {
            if (item.in_report) {
              this.complete_principles.push(item.codigoprincipio)
            }
          });
          this.loading = false;


        } else {
          this.messagesPopups.popupMessage('Error: ' + data.message);
          this.loading = false;

        }
      },
      (error) => {
        this.messagesPopups.popupMessage('Error al obtener datos: ' + error);
        console.error('Error al obtener datos:', error);
        this.loading = false;

      }
    );
  }
  goPrinciple(element: any) {
    this.router.navigate([`/report/principle-${element.idprincipio}`]);
  }
  editPrinciple(element: any) {
    this.router.navigate([`/principles/principle-edit/${element.idprincipio}`]);
  }
  backPrincipleList() {
    // this.route.navigate([`/principles/results/${objetivoValores.idobjetivevalue}`]);
    this.router.navigate([`/report/report-list`]);
    // this.shareDataService.sendData(this.local_data.idclasificacion)

  }


  openDialog(action: string, obj: any): void {


    obj.action = action;
    obj.autor = this.idUsuario;
    obj.idreporte = this.local_data.idreporte;

    const dialogRef = this.dialog.open(DialogListReport, {
      data: {
        param1: obj,
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

        if (result.event === 'Generar Reporte') {
          this.update(result);
        }

        if (result.event === 'Cerrar Reporte') {
          this.close(result);
        }
      };
    });
  }

  close(row_obj: any): boolean | any {

    this.loading = true;
    this.reportsService.delete(row_obj.data.idreporte).subscribe(
      data => {
        if (data.message == 'success') {
          this.complete_principles = [];
          this.ngOnInit();
          this.messagesPopups.popupMessage(data.message);
        } else {
          this.complete_principles = [];
          this.openDialog(row_obj.event, row_obj.data);
          this.messagesPopups.popupMessage('Error: ');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.complete_principles = [];
        this.openDialog(row_obj.event, row_obj.data);
        this.messagesPopups.popupMessage('Error al obtener datos: ' + error);
        console.error('Error al obtener datos:', error);
      }
    );
  }
  update(row_obj: any): void {

    this.loading = true;
    //Para que me devuelva los principios que no estan completos

    // this.local_data_Principles.forEach((item: any) => {
    //   if(!item.in_report){
    //     this.incomplete_principles.push(item.codigoprincipio)
    //   }
    // });
    // if (this.incomplete_principles.length ===0) {
    //   console.log('true');

    this.reportsService.update(row_obj.data).subscribe(
      async (data: any) => {
        if (data.message == 'success') {
          // this.getDataInfo(this.currentPage, this.pageSize); // Llamada a getDataInfo aquí
          try {
            await this.reportsService.openDocument(data.data);
            // Si necesitas ejecutar código después de abrir el documento, puedes hacerlo aquí.
          } catch (error: any) {
            this.messagesPopups.popupMessage(error);
            console.error(error);
          }
        } else {
          this.messagesPopups.popupMessage(data.message);
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.messagesPopups.popupMessage('Error al obtener datos: ' + error);
        console.error('Error al obtener datos:', error);
      }
    );


    // }
    // else{
    //   this.messagesPopups.popupMessage('Completar los principios: '+ this.incomplete_principles);
    //   this.incomplete_principles = [];

    // }
  }
}



//Dialog Component
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-report-list',
  templateUrl: './dialog-report-list.html'
})
// tslint:disable-next-line: component-class-suffix
export class DialogListReport implements OnInit {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  localBranchData: any[] = [];

  selectedCountryName: string = '';
  showDialog: boolean = true;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<DialogListReport>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.local_data = data.param1;
    this.action = this.local_data.action;
  }

  async ngOnInit(): Promise<void> {
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog(): void {
    this.dialogRef.close();
    this.showDialog = false;
  }

  onInputReportName(event: any) {
    // Filtrar caracteres no deseados (letras y números)
    event.target.value = event.target.value.replace(/[^a-zA-Z0-9]/g, '');
  }

}

