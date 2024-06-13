import { Component, OnInit } from '@angular/core';
import { CorporationService } from '@app/services/corporation.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GeographyService } from '@app/services/geography.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-view-corporation',
  templateUrl: './view-corporation.component.html',
  styleUrls: ['./view-corporation.component.scss']
})
export class ViewCorporationComponent implements OnInit  {
 
  loading: boolean = false;
  id: any;
  local_data: any ={}
  corporation_data: any ={};
  selectedCountryName: string = '';



  constructor(
    activatedRouter: ActivatedRoute, 
    private corporationService: CorporationService,
    public geographyService: GeographyService,
    ) {
    this.id = activatedRouter.snapshot.paramMap.get('id');
  }

  async ngOnInit(): Promise<void> {
    await this.getCorporationData();
  }

  async getCorporationData(){
    try {
      this.loading = true;
      this.corporation_data = await firstValueFrom(this.corporationService.getDataById(this.id));
      
      this.local_data = this.corporation_data.data;
      
      this.loading = false;
    } catch (error) {
       
      console.error("Ocurrió un error al obtener los datos de la corporación:", error);
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


