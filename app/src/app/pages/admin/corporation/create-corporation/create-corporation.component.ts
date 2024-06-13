import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl, UntypedFormArray, NgForm, FormGroup } from '@angular/forms';
import { CorporationModel } from '@app/models/corporation';
import { DatePipe } from '@angular/common';
import { CorporationService } from '@app/services/corporation.service';
import { MessagesPopups } from '@app/helpers/messagesPopups';
import { Observable, firstValueFrom, map, startWith } from 'rxjs';
import { GeographyService } from '@app/services/geography.service';
import { GeographyModel } from '@app/models/geography';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-corporation',
  templateUrl: './create-corporation.component.html',
  styleUrls: ['./create-corporation.component.scss']
})
export class CreateCorporationComponent {
  loading: boolean = false;

  action: string;
  local_data: CorporationModel = new CorporationModel();
  localCorporationData: CorporationModel[] = [];
  countryControl = new FormControl(null, Validators.required);
  filteredGeography: Observable<any[]>;
  selectedCountryName: string = '';
  _corporationModel: CorporationModel = new CorporationModel();
  localGeographyData: GeographyModel[];
  countryLength:any

  constructor(
    public datePipe: DatePipe,
    public corporationService: CorporationService,
    public messagesPopups: MessagesPopups,
    public geographyService: GeographyService,
    public route: Router



  ) {

  }

  async ngOnInit(): Promise<void> {
    await this.getGeography();
    await this.generate();
    this.selectedCountryName = this.local_data.belong;
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
  saveDetail() {


    this.loading = true;

    this.corporationService.create(this.local_data).subscribe(
      data => {
        if (data.message == 'success') {
          // if (data) {
          this.local_data = new CorporationModel();
          this.messagesPopups.popupMessage(data.message);
          this.route.navigate(['/admin/corporation']);

        } else {
          this.messagesPopups.popupMessage('Error: ' + data.message);
          // this.messagesPopups.popupMessage('Error: ' );
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
      // countries: groupedCountries[key].filter(country => country.nombre.toLowerCase().includes(filterValue))
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
