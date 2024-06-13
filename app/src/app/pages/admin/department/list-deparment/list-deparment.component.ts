import { CorporationModel } from '@app/models/corporation';
import { Component, Inject, Optional, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MessagesPopups } from "@app/helpers/messagesPopups";
import { Router } from '@angular/router';
import { DepartmentService } from '@app/services/department.service';
import { DepartmentModel } from '@app/models/department';


@Component({
  selector: 'app-list-deparment',
  templateUrl: './list-deparment.component.html',
  styleUrls: ['./list-deparment.component.scss']
})
export class ListDeparmentComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  loading: boolean = false;

  _departmentModel: DepartmentModel = new DepartmentModel();
  departmentData:DepartmentModel[];

  displayedColumns: string[] = [
    'iddepartamento',
    'nombredepartamento',
    'nombresucursal',
    'status', 
    'action',
  ];

  dataSource = new MatTableDataSource<CorporationModel>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog, 
    public datePipe: DatePipe,
    public departmentService: DepartmentService,
    public messagesPopups: MessagesPopups,
    public route: Router
  ) {
    this.dataSource = new MatTableDataSource<CorporationModel>();
  }

  ngOnInit(): void {
    this.getDataInfo(this.currentPage, this.pageSize);
  }

  // ngAfterViewInit(): void {
  //   this.dataSource.paginator = this.paginator;
  // }

  getDataInfo(page: number, pageSize: number) {

    this.departmentService.getAllData(page, pageSize, this.searchText).subscribe(
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
    this.route.navigate(['/admin/department-create']);
  }

  refreshPage() {
    this.ngOnInit(); 

  }
  viewPage(id:any){
    this.route.navigate([`/admin/department-view/${id}`]);
  
  }

  editPage(id:any){
    this.route.navigate([`/admin/department-edit/${id}`]);
  
  }
  openDialog(action: string, obj: DepartmentModel): void {


    obj.action = action;

    const dialogRef = this.dialog.open(DialogListDepartmentComponent, {
      data: { 
        param1: obj,
        param2: this.departmentData
      }
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        
        if (result.event === 'Delete') {
          this.delete(result);
        }
      };
    });
  }
 
  // tslint:disable-next-line - Disables all
  delete(row_obj:any): boolean | any {
  
      this.loading = true;
      this.departmentService.delete(row_obj.data.iddepartamento).subscribe(
        data => {
          if(data.message == 'success'){
            this._departmentModel = new DepartmentModel();
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
  }


  

//Dialog Component
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-list-department',
  templateUrl: './dialog-list-department.html'
})
// tslint:disable-next-line: component-class-suffix
export class DialogListDepartmentComponent implements OnInit {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: DepartmentModel;
  localBranchData:DepartmentModel[] = [];

  selectedCountryName: string = '';
  showDialog: boolean = true;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<DialogListDepartmentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.local_data = data.param1;
    this.action = this.local_data.action;
    this.localBranchData = data.param2;
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