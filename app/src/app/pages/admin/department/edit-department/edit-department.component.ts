import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MessagesPopups } from '@app/helpers/messagesPopups';
import { Observable, startWith, map, firstValueFrom, of } from 'rxjs';
import { DepartmentModel } from '@app/models/department';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '@app/services/department.service';
import { BranchModel } from '@app/models/branch';
import { BranchService } from '@app/services/branch.service';
import { CorporationModel } from '@app/models/corporation';
import { CorporationService } from '@app/services/corporation.service';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.scss']
})
export class EditDepartmentComponent {
  loading: boolean = false;
  id: any;

  action: string;
  local_data: DepartmentModel = new DepartmentModel();
  localDepartmentData: DepartmentModel[] = [];
  branchControl = new FormControl(Validators.required);
  corporationControl = new FormControl(Validators.required);
  selectedBranchName: string = '';
  selectedCorporationName: string = '';
  _departmentModel: DepartmentModel = new DepartmentModel();
  localBranchData: BranchModel[];
  localCorporationData: CorporationModel[];
  localBranchDataOriginal: any[];
  filteredOptions: Observable<any[]>;
  filteredOptionsBranch: Observable<any[]>;
  firstoption: string[] = ['One', 'Two', 'Three'];
  department_data: any ={};
  dataBranch: BranchModel[];




  constructor(
    public datePipe: DatePipe,
    public departmentService: DepartmentService,
    public corporationService: CorporationService,
    public messagesPopups: MessagesPopups,
    public branchService: BranchService,
    public route:Router,
    activatedRouter: ActivatedRoute,

  ) {
    this.id = activatedRouter.snapshot.paramMap.get('id');

  }

  async ngOnInit(): Promise<void> {
  
  await this.getDepartmentData();
  await this.getCorporation();
  await this.generate();
  await this.getDataBranch(this.local_data.idcorporacion);



  }


  async getDepartmentData() {
    try {
      this.loading = true;
  
      this.department_data = await firstValueFrom(this.departmentService.getDataById(this.id));
  
       
      this.local_data = this.department_data.data; 
      this.selectedBranchName = this.local_data.nombresucursal;
      this.selectedCorporationName = this.local_data.nombrecorporacion;
  
      this.loading = false;
    } catch (error) {
      console.error('Error al obtener datos del departamento', error);
      this.messagesPopups.popupMessage('Error al obtener datos del departamento');

       
      this.loading = false;  
    }
  }
  



  private async generate() {
    this.filteredOptions = this.corporationControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

  }

  private _filter(value: any): any[] {
    if (typeof value !== 'string') {
      return [];  
  }
    const filterValue = value.toLowerCase();
    return this.localCorporationData
    .filter(option => {
      const opt = option.nombrecorporacion.toLowerCase().includes(filterValue)
      if(!opt){
        this.corporationControl.setErrors({ 'invalid': true });
      }
      return opt
    })
  }

  private _filterBranch(value: any): any[] {
    if (typeof value !== 'string') {
      return [];  
  }
    const filterValue = value.toLowerCase();
    return this.dataBranch
      .filter(option => {
        const opt = option.nombresucursal.toLowerCase().includes(filterValue)
        if (!opt) {
          this.branchControl.setErrors({ 'invalid': true });
        }
        return opt
      })
  }


 async getCorporation() {
  try {
    const corporationresponse: any = await firstValueFrom(this.corporationService.getData());
    this.localCorporationData = corporationresponse.data;
  } catch (error) {
    console.error('Error al obtener datos de la corporación:', error);
     
  }
}

  async getDataBranch(idCorporation: any) {
    
    this.loading = true;

    this.branchService.getDataByIdCorporation(idCorporation).subscribe(data => {
      if (data.message == 'success') {
        this.dataBranch = data.data;

        this.loading = false;
        this.filteredOptionsBranch = this.branchControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterBranch(value || '')),
        );

      } else {
        this.loading = false;
        this.messagesPopups.popupMessage('Alerta: ' + data.message);
        this.dataBranch = [];
        this.filteredOptionsBranch = of([]);



      }
    },
      (error) => {
        console.log(error);
        this.messagesPopups.popupMessage('Alerta: Error al realizar la peticion');
        this.loading = false;
        this.dataBranch = [];
        this.filteredOptionsBranch = of([]);


      }
    );
  }
  
  updateDetail() {

    this.loading = true;

    this.departmentService.update(this.local_data).subscribe(
      data => {
        if (data.message == 'success') {
          this.local_data = new DepartmentModel();
          this.messagesPopups.popupMessage(data.message);
          this.route.navigate(['/admin/department']);
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
 
  selectOptionBranch(selectedBranch: any) {
    
    if (selectedBranch) {

      this.local_data.idsucursal = selectedBranch.idsucursal;
      this.selectedBranchName = selectedBranch.nombresucursal;
      this.branchControl.setValue(selectedBranch.nombresucursal);
      this.branchControl.updateValueAndValidity();
    }
  }


  selectOptionCorporation(selectedCorporation: any) {
    if (selectedCorporation) {
      this.selectedCorporationName = selectedCorporation.nombrecorporacion;

      this.corporationControl.setValue(selectedCorporation.nombrecorporacion);
      this.corporationControl.updateValueAndValidity();
      this.getDataBranch(selectedCorporation.idcorporacion);

    }
  }

  resetAutocompleteCorporation() {
    this.branchControl.reset();
    this.filteredOptionsBranch = of([]);
    this.local_data.idsucursal='';

  }
}
