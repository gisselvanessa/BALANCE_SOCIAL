import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl, UntypedFormArray, NgForm, FormGroup } from '@angular/forms';
import { CorporationModel } from '@app/models/corporation';
import { DatePipe } from '@angular/common';
import { CorporationService } from '@app/services/corporation.service';
import { MessagesPopups } from '@app/helpers/messagesPopups';
import { Observable, firstValueFrom, map, startWith } from 'rxjs';
import { GeographyService } from '@app/services/geography.service';
import { GeographyModel } from '@app/models/geography';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';


@Component({
  selector: 'app-edit-corporation',
  templateUrl: './edit-corporation.component.html',
  styleUrls: ['./edit-corporation.component.scss']
})
export class EditCorporationComponent {
  loading: boolean = false;
  id: any;
  local_data: CorporationModel = new CorporationModel();
  corporation_data: any ={};
  countryControl = new FormControl();
  dateControl = new FormControl();
  filteredGeography: Observable<any[]>;
  selectedCountryName: string = '';
  localGeographyData: GeographyModel[];

  constructor(
    public datePipe: DatePipe,
    public corporationService: CorporationService,
    public messagesPopups: MessagesPopups,
    public geographyService: GeographyService,
    public route:Router,
    activatedRouter: ActivatedRoute,


  ) {
    this.id = activatedRouter.snapshot.paramMap.get('id');
    
  }
  async ngOnInit(): Promise<void> {
    
    await this.getCorporationData();
    await this.getGeography();
    await this.generate();

  }

  async getCorporationData() {
    try {
      this.loading = true;
      
      // Obtener datos de la corporación
      this.corporation_data = await firstValueFrom(this.corporationService.getDataById(this.id));
      
      // Obtener datos del país
      let countrySelected:any;
      try {
        countrySelected = await firstValueFrom(this.geographyService.getDataById(this.corporation_data.data.idgeografia));
      } catch (error) {
        console.error('Error al obtener datos del país:', error);
         this.messagesPopups.popupMessage('No existen datos del país');
      }
      
       
      this.local_data = this.corporation_data.data;
      this.local_data.fechacreacion = new Date(this.formatDateData(this.local_data.fechacreacion));
  
      if (countrySelected) {
        const { nombre } = countrySelected.data;
        this.selectedCountryName = nombre;
      }
      
      this.loading = false;
    } catch (error) {
      // Manejar errores generales
      console.error('Error al obtener datos:', error);
      this.messagesPopups.popupMessage('Error: ' + error);

      this.loading = false;  
      // También puedes realizar otras acciones de manejo de errores generales según sea necesario
    }
  }
  


  formatDateData(timestamp: Date | null): string {
    if (timestamp === null) {
      return '';  
    }
    return format(new Date(timestamp), 'MM/dd/yyyy');
  }

  async getGeography() {
    try {
      const geographyresponse: any = await firstValueFrom(this.geographyService.getData());
      this.localGeographyData = geographyresponse.data;
    } catch (error) {
       
      console.error("Ocurrió un error al obtener los datos de geografía:", error);
    }
  }
  

  onInputValue(event: any) {
     
    event.target.value = event.target.value.replace(/[^0-9.]/g, '');
  }
  updateDetail() {
    this.loading=true;
    
    this.corporationService.update(this.local_data).subscribe(
      data => {
        // if (data) {
        if (data.message == 'success') {
          this.messagesPopups.popupMessage(data.message);
          this.route.navigate(['/admin/corporation']);
        } else {
          // this.messagesPopups.popupMessage('Error: ');
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
    this.local_data.idgeografia = selectedCountry.idgeografia;
  }

}
