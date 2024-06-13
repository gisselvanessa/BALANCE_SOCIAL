import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessagesPopups } from "@app/helpers/messagesPopups";

import { RoleModel } from "@app/models/role";
import { RoleService } from "@app/services/role.service";

import { RolePrivilegeModel } from "@app/models/rolePrivilege";
import { PrivilegeService } from "@app/services/privilege.service";
import { Observable, startWith, map, firstValueFrom, of } from 'rxjs';
import { DepartmentModel } from '@app/models/department';
import { CorporationModel } from '@app/models/corporation';
import { BranchModel } from '@app/models/branch';
import { BranchService } from '@app/services/branch.service';
import { CorporationService } from '@app/services/corporation.service';
import { DepartmentService } from '@app/services/department.service';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent {
  loading: boolean = true;
  id: any;

  roleSelected: RoleModel = new RoleModel();
  displayedColumns = ['description', 'status'];

  dataRole: RoleModel[];
  dataGrant: RolePrivilegeModel[] = [];
  dataDeny: RolePrivilegeModel[] = [];

  branchControl = new FormControl(Validators.required);
  corporationControl = new FormControl(Validators.required);
  departmentControl = new FormControl(Validators.required);
  roleControl = new FormControl();

  selectedBranchName: string = '';
  selectedCorporationName: string = '';
  selectedDepartmentName: string = '';

  filteredOptionsCorporation: Observable<any[]>;
  filteredOptionsBranch: Observable<any[]>;
  filteredOptionsDepartment: Observable<any[]>;
  localBranchData: BranchModel[];
  localCorporationData: CorporationModel[];
  localDepartmentData: DepartmentModel[];
  localBranchDataOriginal: any[];
  local_data: RoleModel = new RoleModel();
  rol_data: any = {};



  constructor(
    public router: Router,
    public dialog: MatDialog,
    private messagesPopups: MessagesPopups,
    private roleService: RoleService,
    private privilegeService: PrivilegeService,
    public branchService: BranchService,
    public corporationService: CorporationService,
    public departmentService: DepartmentService,
    activatedRouter: ActivatedRoute,


  ) {
    this.id = activatedRouter.snapshot.paramMap.get('id');

  };

  async ngOnInit(): Promise<void> {
    this.loading = true;
    await this.getDataRole();
    await this.getCorporation();
    await this.generate();
    await this.getDataBranch(this.local_data.idcorporacion);
    await this.getDataDepartment(this.local_data.idsucursal);
    this.loading = false;

  };

  private async generate() {
    this.filteredOptionsCorporation = this.corporationControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCorporation(value || '')),
    );

  }

  private _filterCorporation(value: any): any[] {
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

    return this.localBranchData
      .filter(option => {
        const opt = option.nombresucursal.toLowerCase().includes(filterValue)
        if (!opt) {
          this.branchControl.setErrors({ 'invalid': true });
        }
        return opt
      })
  }

  private _filterDepartment(value: any): any[] {
    if (typeof value !== 'string') {
      return [];  
  }
    const filterValue = value.toLowerCase();

    return this.localDepartmentData
      .filter(option => option.nombredepartamento.toLowerCase().includes(filterValue))
  }
  async getDataRole() {
    this.loading = true;

    this.roleService.getDataById(this.id).subscribe(async data => {
      if (data.message == 'success') {

        this.dataRole = data.data;
        this.rol_data = data.data
        this.local_data = this.rol_data

        this.selectedBranchName = this.local_data.nombresucursal;
        this.selectedCorporationName = this.local_data.nombrecorporacion;
        this.selectedDepartmentName = this.local_data.nombredepartamento;


        this.loading = false;

      } else {
        this.loading = false;
        this.messagesPopups.popupMessage('Alerta: ' + data.message);
        this.dataRole = [];


      }
    },
      (error) => {
        console.log(error);
        this.messagesPopups.popupMessage('Alerta: Error al realizar la peticion');
        this.loading = false;
        this.dataRole = [];

      }
    );
  }
  async getCorporation() {
    try {
      const corporationresponse: any = await firstValueFrom(this.corporationService.getData());
      this.localCorporationData = corporationresponse.data;
    } catch (error) {
      console.error('Error al obtener datos de la corporación:', error);
      this.messagesPopups.popupMessage('No existen datos de la corporación');

       
    }
  }

  async getDataBranch(idCorporation: any) {
    this.loading = true;

    this.branchService.getDataByIdCorporation(idCorporation).subscribe(data => {
      if (data.message == 'success') {
        this.localBranchData = data.data;

        this.loading = false;
        this.filteredOptionsBranch = this.branchControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterBranch(value || '')),
        );

      } else {
        this.loading = false;
        this.messagesPopups.popupMessage('Alerta: ' + data.message);
        this.localBranchData = [];
        this.filteredOptionsBranch = of([]);



      }
    },
      (error) => {
        console.log(error);
        this.messagesPopups.popupMessage('No existen agencias para esta corporación. Cree uno!');

        this.loading = false;
        this.localBranchData = [];
        this.filteredOptionsBranch = of([]);


      }
    );
  }

  async getDataDepartment(idBranch: any) {
    this.loading = true;

    this.departmentService.getDataByIdBranch(idBranch).subscribe(data => {
      if (data.message == 'success') {
        this.localDepartmentData = data.data;
        this.filteredOptionsDepartment = this.departmentControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterDepartment(value || '')),
        );
        this.loading = false;

      } else {
        this.loading = false;
        this.messagesPopups.popupMessage('Alerta: ' + data.message);
        this.localDepartmentData = [];
        this.filteredOptionsDepartment = of([]);



      }
    },
      (error) => {
        console.log(error);
        this.messagesPopups.popupMessage('No existen departamentos para esta agencia. Cree uno!');
        this.loading = false;
        this.localDepartmentData = [];
        this.filteredOptionsDepartment = of([]);


      }
    );
  }
  updateDetail() {

    this.loading = true;

    this.roleService.update(this.local_data).subscribe(
      (data:any) => {
        if (data) {
          this.local_data = new RoleModel();
          this.messagesPopups.popupMessage('success');
          this.router.navigate(['/admin/role']);
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




  selectOptionDepartment(selectedDepartment: any) {
    if (selectedDepartment) {
      this.local_data.iddepartamento = selectedDepartment.iddepartamento;
      this.selectedDepartmentName = selectedDepartment.nombredepartamento;
      this.departmentControl.setValue(selectedDepartment.nombredepartamento);
      this.departmentControl.updateValueAndValidity();

    }
  }

  selectOptionBranch(selectedBranch: any) {
    if (selectedBranch) {
      this.selectedBranchName = selectedBranch.nombresucursal;
      this.branchControl.setValue(selectedBranch.nombresucursal);
      this.branchControl.updateValueAndValidity();
      this.getDataDepartment(selectedBranch.idsucursal);
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
    this.departmentControl.reset();
    this.filteredOptionsBranch = of([]);
    this.filteredOptionsDepartment = of([]);
    this.local_data.idsucursal='';
    this.local_data.iddepartamento='';

  }
  resetAutocompleteBranch() {
    this.departmentControl.reset();
    this.filteredOptionsDepartment = of([]);
    this.local_data.iddepartamento='';

  }
}
