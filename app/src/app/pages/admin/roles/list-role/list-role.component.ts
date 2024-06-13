import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
import { DatePipe } from '@angular/common';
import { PagesService } from '@app/services/pages.service';


@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.scss']
})
export class ListRoleComponent {
  loading: boolean = true;
  _roleModel: RoleModel = new RoleModel();
  roleSelected: RoleModel = new RoleModel();
  displayedColumns = ['description', 'status'];

  dataRole: RoleModel[];
  dataGrant: RolePrivilegeModel[] = [];
  dataDeny: RolePrivilegeModel[] = [];

  branchControl = new FormControl();
  corporationControl = new FormControl();
  departmentControl = new FormControl();
  id: any
  selectedBranchName: string = '';
  selectedCorporationName: string = '';
  selectedDepartmentName: string = '';

  filteredOptionsCorporation: Observable<any[]>;
  filteredOptionsBranch: Observable<any[]>;
  filteredOptionsDepartment: Observable<any[]>;
  localBranchData: BranchModel[];
  localCorporationData: CorporationModel[];
  localDepartmentData: DepartmentModel[];
  localPagesData: any[];
  localBranchDataOriginal: any[];
  local_data: RoleModel = new RoleModel();



  constructor(
    public router: Router,
    public dialog: MatDialog,
    private messagesPopups: MessagesPopups,
    private roleService: RoleService,
    private privilegeService: PrivilegeService,
    public branchService: BranchService,
    public corporationService: CorporationService,
    public pagesService: PagesService,
    public departmentService: DepartmentService,

  ) {

  };

  async ngOnInit(): Promise<void> {
    this.loading = true;
    await this.getCorporation();
    // await this.getDataRole(this.id); //quitar
    // await this.getPages();
    await this.generate();
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
        if (!opt) {
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

    // return this.localBranchData
    //   .filter(option => option.nombresucursal.toLowerCase().includes(filterValue))

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

  async getCorporation() {
    try {
      const corporationresponse: any = await firstValueFrom(this.corporationService.getData());
      this.localCorporationData = corporationresponse.data;
    } catch (error) {
      console.error('Error al obtener datos de la corporación:', error);
      this.messagesPopups.popupMessage('No existen datos de la corporación');


    }
  }
  async getPages() {
    try {
      const pagesresponse: any = await firstValueFrom(this.pagesService.getAllData());
      this.localPagesData = pagesresponse.data;
    } catch (error) {
      console.error('Error al obtener datos de las páginas:', error);
      this.messagesPopups.popupMessage('Error al obtener datos de las páginas');


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
        this.messagesPopups.popupMessage('Alerta1: ' + data.message);
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

  // async getDataRole(idDepartment:any){ //quitar
  async getDataRole(idDepartment: any) {
    this.loading = true;

    this.roleService.getDataByIdDepartment(idDepartment).subscribe(data => {
      // this.roleService.getAllData().subscribe( data => { //quitar
      if (data.message == 'success') {
        this.dataRole = data.data;

        this.loading = false;

      } else {
        this.loading = false;
        this.messagesPopups.popupMessage('Alerta: ' + data.message);
        this.dataRole = [];


      }
    },
      (error) => {
        console.log(error);
        this.messagesPopups.popupMessage('No existen roles para este departamento. Cree uno!');
        this.loading = false;
        this.dataRole = [];

      }
    );
  }
  // tslint:disable-next-line: typedef
  async roleSelect(type: RoleModel): Promise<void> {
    this.loading = true;
    this.roleSelected = type;

    for (let data of this.dataRole) {
      data.active = data.idrol === type.idrol;
    }

    try {
      this.privilegeService.getPrivilegeByIdRole(this.roleSelected.idrol).subscribe(data => {
        if (data.message == 'success') {
          this.dataGrant = data.granted;
          this.dataDeny = data.denied;
        } else {
          this.messagesPopups.popupMessage('Alerta: ' + data.message);
        }
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      this.loading = false;
      this.messagesPopups.popupMessage('Alerta: Error al realizar la peticion');
    }
  };

  grantPage(data: RolePrivilegeModel) {
    this.loading = true;
    if (this.roleSelected.idrol === '') {
      this.messagesPopups.popupMessage('Por favor seleccione un Rol');
      return;
    }

    try {

      this.privilegeService.grantRole(data.idprivilegio).subscribe(data => {
        if (data.message == 'success') {
          this.roleSelect(this.roleSelected);
          this.messagesPopups.popupMessage('Accesso Otorgado');
        } else {
          this.messagesPopups.popupMessage('Alerta: ' + data.message);
        }
      });
      this.loading = false;
    } catch (error) {
      console.log(error);
      this.loading = false;
      this.messagesPopups.popupMessage('Alerta: Error al realizar la peticion');
    }
  };

  denyPage(data: RolePrivilegeModel) {
    this.loading = true;

    if (this.roleSelected.idrol === '') {
      this.messagesPopups.popupMessage('Por favor seleccione un Rol');
      return;
    }

    try {
      this.privilegeService.denyRole(data.idprivilegio).subscribe(data => {
        if (data.message == 'success') {
          this.roleSelect(this.roleSelected);

          this.messagesPopups.popupMessage('Accesso Denegado');
        } else {
          this.messagesPopups.popupMessage('Alerta: ' + data.message);
        }
      });
      this.loading = false;
    } catch (error) {
      console.log(error);
      this.loading = false;
      this.messagesPopups.popupMessage('Alerta: Error al realizar la peticion');
    }
  };

  // Compose button
  openDialogCreate(): void {

    this.router.navigate(['/admin/role-create']);

  }
  viewPage(id: any) {
    this.router.navigate([`/admin/role-view/${id}`]);

  }

  editPage(id: any) {
    this.router.navigate([`/admin/role-edit/${id}`]);

  }
  openDialogDelete(action: string, obj: RoleModel): void {


    obj.action = action;

    const dialogRef = this.dialog.open(DialogListRoleComponent, {
      data: {
        param1: obj,
        param2: this.dataRole
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

        if (result.event === 'Delete') {
          this.delete(result);
        }
      };
    });
  }

  delete(row_obj: any): boolean | any {

    this.loading = true;

    this.roleService.delete(row_obj.data.idrol).subscribe(
      data => {
        if (data.message == 'success') {
          this._roleModel = new RoleModel();
          this.getDataRole(row_obj.data.iddepartamento);
          this.messagesPopups.popupMessage(data.message);
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


  selectOptionDepartment(selectedDepartment: any) {

    this.local_data.iddepartamento = selectedDepartment.iddepartamento;
    this.selectedDepartmentName = selectedDepartment.nombredepartamento;
    this.departmentControl.setValue(selectedDepartment.nombredepartamento);
    this.departmentControl.updateValueAndValidity();

    this.getDataRole(selectedDepartment.iddepartamento);

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
    this.local_data.idsucursal = '';
    this.local_data.iddepartamento = '';
  }
  resetAutocompleteBranch() {
    this.departmentControl.reset();
    this.filteredOptionsDepartment = of([]);
    this.local_data.iddepartamento = '';

  }
}

@Component({
  selector: 'app-dialog-list-role',
  templateUrl: './dialog-list-role.html',
})
export class DialogListRoleComponent implements OnInit {
  form: UntypedFormGroup;

  htmlContent = '';
  action: string;
  showDialog: boolean = true;

  // tslint:disable-next-line - Disables all
  local_data: RoleModel;
  localRoleData: RoleModel[] = [];

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<DialogListRoleComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder
  ) {

    this.local_data = data.param1;
    this.action = this.local_data.action;
    this.localRoleData = data.param2;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      signature: ['', Validators.required],
    });
  }

  onChange(event: any) {
    console.log('changed');
  }

  onBlur(event: any) {
    console.log('blur ' + event);
  }
  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });

  }
  closeDialog(): void {
    this.dialogRef.close();
    this.showDialog = false;
  }

}
