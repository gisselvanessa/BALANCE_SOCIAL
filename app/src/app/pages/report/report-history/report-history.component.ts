import { Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MessagesPopups } from '@app/helpers/messagesPopups';
import { LoginService } from '@app/services/login.service';
import { ReportsService } from '@app/services/reports.service';

@Component({
  selector: 'app-report-history',
  templateUrl: './report-history.component.html',
  styleUrls: ['./report-history.component.scss']
})
export class ReportHistoryComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  idReport: number = 0;
  loading: boolean = false;
  idUsuario: any;
  local_data: any = [];

  constructor(
    private loginService: LoginService,
    private reportsService: ReportsService,
    public messagesPopups: MessagesPopups,

  ) {
    const user = this.loginService.userValue;
    this.idUsuario = user?.idusuario;

  }
  async ngOnInit(): Promise<void> {

    this.getDataInfo(this.currentPage, this.pageSize, this.local_data.idreporte);

  }
  getDataInfo(page: number, pageSize: number, idReport: any) {
    this.loading=true;

    this.reportsService.getDataByIdUser(this.idUsuario).subscribe(
      (data: any) => {

        if (data) {
          this.totalCount = data.totalCount;
          // this.dataSource.data = data.results;
          this.local_data = data.data
          this.loading=false;

        } else {
          this.messagesPopups.popupMessage('Error: ' + data.message);
          this.loading=false;

        }
      },
      (error) => {
        this.messagesPopups.popupMessage('Error al obtener datos: ' + error);
        console.error('Error al obtener datos:', error);
        this.loading=false;

      }
    );
  }

  async verReporte(element: any) {

    this.loading = true;

    try {
      await this.reportsService.openDocument(element);
      this.loading = false;
      // Si necesitas ejecutar código después de abrir el documento, puedes hacerlo aquí.
    } catch (error: any) {

      this.messagesPopups.popupMessage(error);
      console.error(error);
      this.loading = false;
    }
  }
}
