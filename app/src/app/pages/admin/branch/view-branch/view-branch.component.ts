import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { format } from 'date-fns';
import { BranchService } from '@app/services/branch.service';
import { GeographyService } from '@app/services/geography.service';
import { CorporationService } from '@app/services/corporation.service';
import { MessagesPopups } from '@app/helpers/messagesPopups';

@Component({
  selector: 'app-view-branch',
  templateUrl: './view-branch.component.html',
  styleUrls: ['./view-branch.component.scss']
})
export class ViewBranchComponent {
  loading: boolean = false;
  id: any;
  local_data: any ={}
  branch_data: any ={};
  CountryName: string = '';
  CorporationName: string = '';



  constructor(
    activatedRouter: ActivatedRoute, 
    private branchService: BranchService,
    public geographyService: GeographyService,
    public corporationService: CorporationService,
    public messagesPopups: MessagesPopups
    ) {
    this.id = activatedRouter.snapshot.paramMap.get('id');
  }

  async ngOnInit(): Promise<void> {
    await this.getBranchData();
  }

  async getBranchData() {
    try {
      this.loading = true;
  
      this.branch_data = await firstValueFrom(this.branchService.getDataById(this.id));
  
       
      this.local_data = this.branch_data.data;
  
      this.loading = false;
    } catch (error) {
      console.error('Error al obtener datos de la sucursal:', error);
      this.messagesPopups.popupMessage('Error al obtener datos de la sucursal');

       
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
