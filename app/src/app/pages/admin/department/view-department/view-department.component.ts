import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GeographyService } from '@app/services/geography.service';
import { format } from 'date-fns';
import { DepartmentService } from '@app/services/department.service';
import { BranchService } from '@app/services/branch.service';
import { MessagesPopups } from '@app/helpers/messagesPopups';

@Component({
  selector: 'app-view-department',
  templateUrl: './view-department.component.html',
  styleUrls: ['./view-department.component.scss']
})
export class ViewDepartmentComponent {
  loading: boolean = false;
  id: any;
  local_data: any ={}
  department_data: any ={};
  selectedCountryName: string = '';
  branchName: string = '';



  constructor(
    activatedRouter: ActivatedRoute, 
    private departmentService: DepartmentService,
    public geographyService: GeographyService,
    public branchService: BranchService,
    public messagesPopups: MessagesPopups
    ) {
    this.id = activatedRouter.snapshot.paramMap.get('id');
  }

  async ngOnInit(): Promise<void> {
    await this.getDepartmentData();
  }

  async getDepartmentData() {
    try {
      this.loading = true;
      
      this.department_data = await firstValueFrom(this.departmentService.getDataById(this.id));
       
      this.local_data = this.department_data.data;
  
      this.loading = false;
    } catch (error) {
      console.error('Error al obtener datos del departamento:', error);
      this.messagesPopups.popupMessage('Error al obtener datos del departamento');

       
      this.loading = false;  
    }
  }
  

  formatDateData(timestamp: Date | null): string {
    if (timestamp === null) {
      return '';  
    }
    return format(new Date(timestamp), 'MM/dd/yyyy');
  }
}
