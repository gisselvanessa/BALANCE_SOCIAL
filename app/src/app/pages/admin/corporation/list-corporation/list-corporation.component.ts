import { CorporationModel } from '@app/models/corporation';
import { Component, Inject, Optional, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MessagesPopups } from "@app/helpers/messagesPopups";
import { CorporationService } from '@app/services/corporation.service';
import { EditCorporationComponent } from '../edit-corporation/edit-corporation.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-corporation',
  templateUrl: './list-corporation.component.html',
  styleUrls: ['./list-corporation.component.scss']
})
export class ListCorporationComponent implements AfterViewInit, OnInit  {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  loading: boolean = false;

  _corporationModel: CorporationModel = new CorporationModel();
  corporationData:CorporationModel[];

  displayedColumns: string[] = [
    'idcorporacion',
    'nombrecorporacion',
    'representantelegal',
    'ruc',
    'telefonocorporacion',
    'status',
    'action',
  ];

  dataSource = new MatTableDataSource<CorporationModel>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog, 
    public datePipe: DatePipe,
    public corporationService: CorporationService,
    public messagesPopups: MessagesPopups,
    public route: Router
  ) {
    this.dataSource = new MatTableDataSource<CorporationModel>();
  }

  ngOnInit(): void {
    this.getDataInfo(this.currentPage, this.pageSize);
  }

  ngAfterViewInit(): void {
  }

  getDataInfo(page: number, pageSize: number) {

    this.corporationService.getAllData(page, pageSize, this.searchText).subscribe(
      data => {
        
        if(data.message == 'success'){
          this.totalCount = data.totalCount;
          this.dataSource.data = data.data;
          
        } else {
          this.messagesPopups.popupMessage('Error: '+ data.message);
        }
      },
      (error) => {
        this.messagesPopups.popupMessage('Error al obtener datos: Solicitud incorrecta');
        console.error('Error al obtener datos:', error);
      }
    );    
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
    this.route.navigate(['/admin/corporation-create']);
  }

  openDialog(action: string, obj: CorporationModel): void {


    obj.action = action;

    const dialogRef = this.dialog.open(DialogListCorporationComponent, {
      data: { 
        param1: obj,
        param2: this.corporationData
      }
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        
        if (result.event === 'Delete') {
          this.deleteCorporation(result);
        }
      };
    });
  }
  viewPage(id:any){
    this.route.navigate([`/admin/corporation-view/${id}`]);
  
  }

  editPage(id:any){
    this.route.navigate([`/admin/corporation-edit/${id}`]);
  
  }

  // tslint:disable-next-line - Disables all
  deleteCorporation(row_obj:any): boolean | any {
  
      this.loading = true;
      this.corporationService.delete(row_obj.data.idcorporacion).subscribe(
        data => {
          if(data.message == 'success'){
            this._corporationModel = new CorporationModel();
            this.ngOnInit();
            this.messagesPopups.popupMessage(data.message);
          } else {
            this.messagesPopups.popupMessage('Error: '+ data.message);
          }
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.messagesPopups.popupMessage('Error al obtener datos: Solicitud incorrecta');
          console.error('Error al obtener datos:', error);
        }
      );
    }
    
    refreshPage() {
      this.ngOnInit(); 

    }
}



//Dialog Component
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-list-corporation',
  templateUrl: './dialog-list-corporation.html'
})
// tslint:disable-next-line: component-class-suffix
export class DialogListCorporationComponent implements OnInit {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: CorporationModel;
  localCorporationData:CorporationModel[] = [];

  selectedCountryName: string = '';
  showDialog: boolean = true;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<DialogListCorporationComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.local_data = data.param1;
    this.action = this.local_data.action;
    this.localCorporationData = data.param2;
  }

  async ngOnInit(): Promise<void> {

  }


  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
    
  }
  closeDialog(): void {
    this.dialogRef.close();
    this.showDialog= false;
  }

}