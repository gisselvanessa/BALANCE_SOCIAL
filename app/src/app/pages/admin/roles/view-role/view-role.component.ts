import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GeographyService } from '@app/services/geography.service';
import { format } from 'date-fns';
import { RoleService } from '@app/services/role.service';
import { BranchService } from '@app/services/branch.service';

@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.scss']
})
export class ViewRoleComponent {
  loading: boolean = false;
  id: any;
  local_data: any ={}
  role_data: any ={};
  selectedCountryName: string = '';
  branchName: string = '';



  constructor(
    activatedRouter: ActivatedRoute, 
    private roleService: RoleService,
    public geographyService: GeographyService,
    public branchService: BranchService,
    ) {
    this.id = activatedRouter.snapshot.paramMap.get('id');
  }

  async ngOnInit(): Promise<void> {
    await this.getRoleData();
  }

  async getRoleData() {
    try {
      this.loading = true;
      this.role_data = await firstValueFrom(this.roleService.getDataById(this.id));
      this.local_data = this.role_data.data;
      this.loading = false;
    } catch (error) {
      console.error('Error al obtener datos del rol:', error);
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
