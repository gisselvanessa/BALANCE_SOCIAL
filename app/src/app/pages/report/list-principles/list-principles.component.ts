import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesPopups } from '@app/helpers/messagesPopups';
import { GraphicModel } from '@app/models/graphic';
import { PrincipleModel } from '@app/models/principle';
import { LoginService } from '@app/services/login.service';
import { PrinciplesService } from '@app/services/principles.service';
import { ReportsService } from '@app/services/reports.service';

@Component({
  selector: 'app-list-principles',
  templateUrl: './list-principles.component.html',
  styleUrls: ['./list-principles.component.scss']
})
export class ListPrinciplesComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  searchText: any = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  idReport: number = 0;
  loading: boolean = false;
  _principleModel: PrincipleModel = new PrincipleModel();
  principleData: PrincipleModel[];
  local_data: any = [];
  local_data_Report: any = {};
  graphicData: GraphicModel[];
  idUsuario: any;
  id: any;

  displayedColumns: string[] = [
    'idcorporacion',
    'nombrecorporacion',
    'representantelegal',
    'ruc',
    'telefonocorporacion',
    'status',
    'action',
  ];

  dataSource = new MatTableDataSource<PrincipleModel>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    private router: Router,
    public principlesService: PrinciplesService,
    public reportsService: ReportsService,
    public messagesPopups: MessagesPopups,
    public dialog: MatDialog,
    private loginService: LoginService,
    activatedRouter: ActivatedRoute,
    public route: Router,



  ) {
    this.id = activatedRouter.snapshot.paramMap.get('id');
    const user = this.loginService.userValue;
    this.idUsuario = user?.idusuario;
  }
  ngOnInit(): void {
    this.getDataInfo(this.currentPage, this.pageSize);
  }
  getDataInfo(page: number, pageSize: number) {

    this.principlesService.getAllData(page, pageSize, this.searchText, this.id).subscribe(
      (data:any) => {

        if (data) {
          this.totalCount = data.totalCount;
          this.dataSource.data = data.results;
          this.local_data = data.results

        } else {
          this.messagesPopups.popupMessage('Error: ' + data.message);
        }
      },
      (error) => {
        this.messagesPopups.popupMessage('Error al obtener datos: ' + error);
        console.error('Error al obtener datos:', error);
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
    this.route.navigate([`/report/report-list`]);
    // this.shareDataService.sendData(this.local_data.idclasificacion)

  }

}




