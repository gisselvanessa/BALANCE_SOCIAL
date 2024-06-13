import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessagesPopups } from "@app/helpers/messagesPopups";
import { PersonModel } from "@app/models/person";
import { PersonService } from "@app/services/person.service";
import { PrivilegeService } from "@app/services/privilege.service";
import { Observable, startWith, map, firstValueFrom, of } from 'rxjs';
import { DepartmentModel } from '@app/models/department';
import { CorporationModel } from '@app/models/corporation';
import { BranchModel } from '@app/models/branch';
import { BranchService } from '@app/services/branch.service';
import { CorporationService } from '@app/services/corporation.service';
import { DepartmentService } from '@app/services/department.service';
import { RoleModel } from '@app/models/role';
import { RoleService } from '@app/services/role.service';
import { GenderService } from '@app/services/gender.service';
import { GenderModel } from '@app/models/gender';
import { DniTypesService } from '@app/services/dni-types.service';


@Component({
  selector: 'app-create-person',
  templateUrl: './create-person.component.html',
  styleUrls: ['./create-person.component.scss']
})
export class CreatePersonComponent {
  loading: boolean = true;
  personSelected: PersonModel = new PersonModel();
  displayedColumns = ['description', 'status'];
  alignhide = true;

  dataPerson: PersonModel[];
  dataRole: RoleModel[];
  dataDepartment: DepartmentModel[];
  dataBranch: BranchModel[];


  branchControl = new FormControl();
  corporationControl = new FormControl();
  departmentControl = new FormControl();
  roleControl = new FormControl();


  selectedBranchName: string = '';
  selectedCorporationName: string = '';
  selectedDepartmentName: string = '';
  selectedRoleName: string = '';

  filteredOptionsCorporation: Observable<any[]>;
  filteredOptionsBranch: Observable<any[]>;
  filteredOptionsDepartment: Observable<any[]>;
  filteredOptionsRole: Observable<any[]>;

  localCorporationData: CorporationModel[];
  localGenderData: any[];
  localDnitypesData: any[];


  local_data: PersonModel = new PersonModel();
  maxDniLength: number = 1;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private messagesPopups: MessagesPopups,
    private personService: PersonService,
    private privilegeService: PrivilegeService,
    public branchService: BranchService,
    public corporationService: CorporationService,
    public genderService: GenderService,
    public typedniservice: DniTypesService,
    public departmentService: DepartmentService,
    public roleService: RoleService,

  ) {

  };

  async ngOnInit(): Promise<void> {
    this.loading = true;
    await this.getCorporation();
    await this.getGender();
    await this.getDniTypes();
    await this.generate();
    this.loading = false;

  };

  cambiarMaxlengthDni() {
    switch (this.local_data.idtipoidentificacion) {
        case 1:
            this.maxDniLength = 10; 
            break;
        case 2:
            this.maxDniLength = 13; 
            break;
        case 3:
            this.maxDniLength = 50; 
            break;
            case 4:
            this.maxDniLength = 50; 
            break;
            case 5:
            this.maxDniLength = 50; 
            break;
        default:
            this.maxDniLength = 1; 
    }
}
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

    return this.dataBranch
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

    return this.dataDepartment
      .filter(option => option.nombredepartamento.toLowerCase().includes(filterValue))
  }
  private _filterRole(value: any): any[] {
    if (typeof value !== 'string') {
      return [];  
  }
    const filterValue = value.toLowerCase();

    return this.dataRole
      .filter(option => option.nombrerol.toLowerCase().includes(filterValue))
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
  
  async getGender() {
    try {
      const genderResponse: any = await firstValueFrom(this.genderService.getData());
      this.localGenderData = genderResponse.data;
    } catch (error) {
      console.error('Error al obtener datos de género:', error);
      this.messagesPopups.popupMessage('Error al obtener datos de género');

       
    }
  }
  
  async getDniTypes() {
    try {
      const typesData: any = await firstValueFrom(this.typedniservice.getData());
      this.localDnitypesData = typesData.data;
    } catch (error) {
      console.error('Error al obtener tipos de DNI:', error);
      this.messagesPopups.popupMessage('Error al obtener tipos de identificación');

       
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
        this.messagesPopups.popupMessage('No existen agencias para esta corporación');

        this.loading = false;
        this.dataBranch = [];
        this.filteredOptionsBranch = of([]);


      }
    );
  }



  async getDataDepartment(idBranch: any) {
    this.loading = true;

    this.departmentService.getDataByIdBranch(idBranch).subscribe(data => {
      if (data.message == 'success') {
        this.dataDepartment = data.data;
        this.filteredOptionsDepartment = this.departmentControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterDepartment(value || '')),
        );
        this.loading = false;

      } else {
        this.loading = false;
        this.messagesPopups.popupMessage('Alerta: ' + data.message);
        this.dataDepartment = [];
        this.filteredOptionsDepartment = of([]);



      }
    },
      (error) => {
        console.log(error);
        this.messagesPopups.popupMessage('No existen departamentos para esta agencia. Cree uno!');
        this.loading = false;
        this.dataDepartment = [];
        this.filteredOptionsDepartment = of([]);


      }
    );
  }

  async getDataRole(idDepartment: any) {
    this.loading = true;

    this.roleService.getDataByIdDepartment(idDepartment).subscribe(data => {
      if (data.message == 'success') {
        this.dataRole = data.data;
        this.filteredOptionsRole = this.roleControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterRole(value || '')),
        );  
        this.loading = false;

      } else {
        this.loading = false;
        this.messagesPopups.popupMessage('Alerta: ' + data.message);
        this.dataRole = [];
        this.filteredOptionsRole = of([]);


      }
    },
      (error) => {
        console.log(error);
        this.messagesPopups.popupMessage('No existen roles para este departamento');
        this.loading = false;
        this.dataRole = [];
        this.filteredOptionsRole = of([]);


      }
    );
  }
  onInputValue(event: any) {
     
    event.target.value = event.target.value.replace(/[^0-9.]/g, '');
  }
  saveDetail() {

    this.loading = true;
    
    this.personService.create(this.local_data).subscribe(
      data => {
        if (data.message == 'success') {
          this.local_data = new PersonModel();
          this.messagesPopups.popupMessage(data.message);
          this.router.navigate(['/admin/person']);
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


  selectOptionRole(selectedRole: any) {
    if (selectedRole) {

    this.local_data.idrol = selectedRole.idrol;

    this.selectedRoleName = selectedRole.nombrerol;
    this.roleControl.setValue(selectedRole.nombrerol);
    this.roleControl.updateValueAndValidity();
    }

  }

  selectOptionDepartment(selectedDepartment: any) {
    if (selectedDepartment) {

    this.selectedDepartmentName = selectedDepartment.nombredepartamento;

    this.departmentControl.setValue(selectedDepartment.nombredepartamento);
    this.departmentControl.updateValueAndValidity();

    this.getDataRole(selectedDepartment.iddepartamento);
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
    this.roleControl.reset();
    this.filteredOptionsBranch = of([]); 
    this.filteredOptionsDepartment = of([]); 
    this.filteredOptionsRole = of([]); 

}
resetAutocompleteBranch() {
  this.departmentControl.reset();
  this.roleControl.reset();
  this.filteredOptionsDepartment = of([]); 
  this.filteredOptionsRole = of([]); 
}
resetAutocompleteDepartment() {
  this.roleControl.reset();
  this.filteredOptionsRole = of([]); 

}

}
