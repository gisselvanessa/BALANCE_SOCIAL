import { Component, Inject, Optional, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MessagesPopups } from "@app/helpers/messagesPopups";
import { GenderModel } from "@app/models/gender";
import { Observable, map, startWith } from 'rxjs';
import { GenderService } from '@app/services/gender.service';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.scss']
})
export class GenderComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  loading: boolean = false;

  _genderModel: GenderModel = new GenderModel();
  genderData:GenderModel[];
 
  displayedColumns: string[] = [
    'idgenero',
    'codigogenero',
    'descripciongenero',
    'status',
    'action',
  ];
  
  dataSource = new MatTableDataSource<GenderModel>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog, 
    public datePipe: DatePipe,
    public genderService: GenderService,
    public messagesPopups: MessagesPopups,
  ) {
    this.dataSource = new MatTableDataSource<GenderModel>();
  }

  ngOnInit(): void {
    this.getDataInfo(this.currentPage, this.pageSize);
  }

  ngAfterViewInit(): void {
    this.genderService.getData().subscribe(
      data => {
        if(data.message == 'success'){
          this.genderData = data.data;
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

  getDataInfo(page: number, pageSize: number) {

    this.genderService.getAllData(page, pageSize, this.searchText).subscribe(
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

  openDialog(action: string, obj: GenderModel): void {
    
    obj.action = action;
    
    const dialogRef = this.dialog.open(AppGenderDialogContentComponent, {
      data: {
        param1: obj,
        param2: this.genderData,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        
        if (result.event === 'Add') {
          this.addRowData(result);
        } else if (result.event === 'Update') {
          this.updateRowData(result);
        } else if (result.event === 'Delete') {
          this.deleteRowData(result);
        }
      };
    });
  }

  // tslint:disable-next-line - Disables all
  addRowData(row_obj:any): void {
    
    this.loading = true;
    
    this.genderService.create(row_obj.data).subscribe(
      data => {
        if(data){
        // if(data.message == 'success'){
          this._genderModel = new GenderModel();
          this.ngOnInit();
          this.messagesPopups.popupMessage(data.message);
        } else {
          this.openDialog(row_obj.event, row_obj.data);
          // this.messagesPopups.popupMessage('Error: '+ data.message);
          this.messagesPopups.popupMessage('Error: ');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.openDialog(row_obj.event, row_obj.data);
        this.messagesPopups.popupMessage('Error al obtener datos: Solicitud incorrecta');
        console.error('Error al obtener datos:', error);
      }
    );
  }

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj:any): boolean | any {
    this.loading = true;
    this.genderService.update(row_obj.data).subscribe(
      data => {
        if(data){
        // if(data.message == 'success'){

          this._genderModel = new GenderModel();
          this.ngOnInit();
          this.messagesPopups.popupMessage(data.message);
        } else {
          this.openDialog(row_obj.event, row_obj.data);
          // this.messagesPopups.popupMessage('Error: '+ data.message);
          this.messagesPopups.popupMessage('Error: ');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.openDialog(row_obj.event, row_obj.data);
        this.messagesPopups.popupMessage('Error al obtener datos: Solicitud incorrecta');
        console.error('Error al obtener datos:', error);
      }
    );
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj:any): boolean | any {
    this.loading = true;
    this.genderService.delete(row_obj.data.idgenero).subscribe(
      data => {
        if(data){
        // if(data.message == 'success'){
          this._genderModel = new GenderModel();
          this.ngOnInit();
          this.messagesPopups.popupMessage(data.message);
        } else {
          this.openDialog(row_obj.event, row_obj.data);
          // this.messagesPopups.popupMessage('Error: '+ data.message);
          this.messagesPopups.popupMessage('Error: ');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.openDialog(row_obj.event, row_obj.data);
        this.messagesPopups.popupMessage('Error al obtener datos: Solicitud incorrecta');
        console.error('Error al obtener datos:', error);
      }
    );
  }
}


//Dialog Component
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-gender-dialog',
  templateUrl: 'gender-dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppGenderDialogContentComponent implements OnInit {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: GenderModel;
  localGeographyData:GenderModel[] = [];
  countryControl = new FormControl();
  filteredGeography: Observable<any[]>;
  selectedCountryName: string = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppGenderDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.local_data = data.param1;
    this.action = this.local_data.action;
    this.localGeographyData = data.param2;
    
  }

  async ngOnInit(): Promise<void> {
    await this.generate();
    this.selectedCountryName = this.local_data.belong;
  }

  private async generate() {
    this.filteredGeography = this.countryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );        
  }

  private _filter(value: string): any[] {

    if (typeof value !== 'string') {
      return [];  
  }

    const filterValue = value.toLowerCase();

    // Crear un objeto temporal para organizar los países en grupos
    const groupedCountries: { [key: string]: any[] } = {};

    // Organizar los países en grupos
    this.localGeographyData.forEach(country => {
      const groupKey = country.belong || "Principal";
      if (!groupedCountries[groupKey]) {
        groupedCountries[groupKey] = [];
      }
      groupedCountries[groupKey].push(country);
    });

    // Filtrar y mapear los grupos y elementos
    const filteredAndGroupedCountries = Object.keys(groupedCountries).map(key => ({
      group: key,
      countries: groupedCountries[key].filter(country => {
        const filtered = country.nombre.toLowerCase().includes(value.toLowerCase());
        if (!filtered) {
  
          this.countryControl.setErrors({ 'invalid': true });
        }
        return filtered;
      })
    }));

    return filteredAndGroupedCountries;
  }
  
  // selectOption(selectedCountry: any) {
  //   this.selectedCountryName = selectedCountry.nombre;
  //   this.local_data.fkidgeografia = selectedCountry.idgeografia;
  // }
  

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}

