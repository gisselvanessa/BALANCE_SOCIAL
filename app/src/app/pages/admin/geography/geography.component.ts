import { Component, Inject, Optional, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MessagesPopups } from "@app/helpers/messagesPopups";
import { GeographyModel } from "@app/models/geography";
import { GeographyService } from "@app/services/geography.service";
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-geography',
  templateUrl: './geography.component.html',
  styleUrls: ['./geography.component.scss']
})
export class GeographyComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  loading: boolean = false;

  _geographyModel: GeographyModel = new GeographyModel();
  geographyData:GeographyModel[];
 
  displayedColumns: string[] = [
    'idgeografia',
    'codigogeografia',
    'nombre',
    'nivel',
    'status',
    'fkidgeografia',
    'action',
  ];
  
  dataSource = new MatTableDataSource<GeographyModel>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog, 
    public datePipe: DatePipe,
    public geographyService: GeographyService,
    public messagesPopups: MessagesPopups,
  ) {
    this.dataSource = new MatTableDataSource<GeographyModel>();
  }

  ngOnInit(): void {
    this.getDataInfo(this.currentPage, this.pageSize);
  }

  ngAfterViewInit(): void {
    this.geographyService.getData().subscribe(
      data => {
        if(data.message == 'success'){
          this.geographyData = data.data;
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

    this.geographyService.getAllData(page, pageSize, this.searchText).subscribe(
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

  openDialog(action: string, obj: GeographyModel): void {
    
    obj.action = action;
    
    const dialogRef = this.dialog.open(AppGeographyDialogContentComponent, {
      data: {
        param1: obj,
        param2: this.geographyData,
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
    
    this.geographyService.create(row_obj.data).subscribe(
      data => {
        if(data){
        // if(data.message == 'success'){
          this._geographyModel = new GeographyModel();
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
        this.messagesPopups.popupMessage('Solicitud incorrecta: Código repetido');
        console.error('Error al obtener datos:', error);
      }
    );
  }

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj:any): boolean | any {
    this.loading = true;
    
    this.geographyService.update(row_obj.data).subscribe(
      data => {
        // if(data){
        if(data.message == 'success'){

          this._geographyModel = new GeographyModel();
          this.ngOnInit();
          this.messagesPopups.popupMessage(data.message);
        } else {
          this.openDialog(row_obj.event, row_obj.data);
          this.messagesPopups.popupMessage('Error: '+ data.message);
          // this.messagesPopups.popupMessage('Error: ');
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
    this.geographyService.delete(row_obj.data.idgeografia).subscribe(
      data => {
        if(data.message == 'success'){
          this._geographyModel = new GeographyModel();
          this.ngOnInit();
          this.messagesPopups.popupMessage(data.message);
        } else {
          this.openDialog(row_obj.event, row_obj.data);
          this.messagesPopups.popupMessage('Error: '+ data.message);
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
  selector: 'app-dialog-content',
  templateUrl: 'geography-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppGeographyDialogContentComponent implements OnInit {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: GeographyModel;
  localGeographyData:GeographyModel[] = [];
  countryControl = new FormControl();
  filteredGeography: Observable<any[]>;
  selectedCountryName: string = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppGeographyDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.local_data = data.param1;
    this.action = this.local_data.action;
    this.localGeographyData = data.param2;
    
  }

  async ngOnInit(): Promise<void> {
    await this.generate();
    this.selectedCountryName = this.local_data.belong_name;
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
      const groupKey = country.belong_name || "Principal";
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
  
  selectOption(selectedCountry: any) {
    this.selectedCountryName = selectedCountry.nombre;
    this.local_data.fkidgeografia = selectedCountry.idgeografia;
  }
  

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
