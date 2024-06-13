import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl, UntypedFormArray, NgForm, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BranchService } from '@app/services/branch.service';
import { MessagesPopups } from '@app/helpers/messagesPopups';
import { Observable, firstValueFrom, map, startWith } from 'rxjs';
import { GeographyService } from '@app/services/geography.service';
import { GeographyModel } from '@app/models/geography';
import { BranchModel } from '@app/models/branch';
import { CorporationService } from '@app/services/corporation.service';
import { CorporationModel } from '@app/models/corporation';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-branch',
  templateUrl: './edit-branch.component.html',
  styleUrls: ['./edit-branch.component.scss']
})
export class EditBranchComponent {
  loading: boolean = false;
  id: any;

  action: string;
  local_data: BranchModel = new BranchModel();
  branch_data: any = {};

  countryControl = new FormControl();
  corporationControl = new FormControl(Validators.required);
  filteredGeography: Observable<any[]>;
  selectedCountryName: string = '';
  selectedCorporationName: string = '';
  localGeographyData: GeographyModel[];
  localCorporationData: CorporationModel[];
  filteredOptions: Observable<any[]>;

  constructor(
    public datePipe: DatePipe,
    public branchService: BranchService,
    public messagesPopups: MessagesPopups,
    public geographyService: GeographyService,
    public corporationService: CorporationService,
    public route: Router,
    activatedRouter: ActivatedRoute,



  ) {
    this.id = activatedRouter.snapshot.paramMap.get('id');

  }

  async ngOnInit(): Promise<void> {

    await this.getBranchData();
    await this.getGeography();
    await this.getCorporation();
    await this.generate();
  }

  async getBranchData() {
    try {
      this.loading = true;
      
      this.branch_data = await firstValueFrom(this.branchService.getDataById(this.id));
  
      let countrySelected:any;
      try {
        countrySelected = await firstValueFrom(this.geographyService.getDataById(this.branch_data.data.idgeografia));
      } catch (error) {
        console.error('Error al obtener datos del país:', error);
        this.messagesPopups.popupMessage('No existen datos del país');
      }
  
      let corporationSelected:any;
      try {
        corporationSelected = await firstValueFrom(this.corporationService.getDataById(this.branch_data.data.idcorporacion));
      } catch (error) {
        console.error('Error al obtener datos de la corporación:', error);
        this.messagesPopups.popupMessage('No existen datos de la corporación');
      }
  
      this.local_data = this.branch_data.data; 
  
      if (countrySelected) {
        this.selectedCountryName = countrySelected.data.nombre;
      }
  
      if (corporationSelected) {
        this.selectedCorporationName = corporationSelected.data.nombrecorporacion;
      }
    
      this.loading = false;
    } catch (error) {
      console.error('Error al obtener datos:', error);
      this.loading = false; 
    }
  }
  

  async getGeography() {
    try {
      const geographyresponse: any = await firstValueFrom(this.geographyService.getData());
      this.localGeographyData = geographyresponse.data;
    } catch (error) {
      console.error("Ocurrió un error al obtener los datos de geografía:", error);
    }
  }
  
  async getCorporation() {
    try {
      const corporationresponse: any = await firstValueFrom(this.corporationService.getData());
      this.localCorporationData = corporationresponse.data;
    } catch (error) {
      console.error('Error al obtener datos de la corporación');
       
    }
  }
  
  onInputValue(event: any) {
     
    event.target.value = event.target.value.replace(/[^0-9.]/g, '');
  }
  updateDetail() {
    
    this.loading = true;

    this.branchService.update(this.local_data).subscribe(
      data => {
        // if (data) {
          if (data.message == 'success') {
          this.local_data = new BranchModel();
          this.messagesPopups.popupMessage(data.message);
          this.route.navigate(['/admin/branch']);
          this.loading = false;

        } else {
          // this.messagesPopups.popupMessage('Error: ' );
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
  private async generate() {

    this.filteredOptions = this.corporationControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.filteredGeography = this.countryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGeography(value || '')),
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

  private _filterGeography(value: string): any[] {
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

  selectOptionCountry(selectedCountry: any) {

    this.selectedCountryName = selectedCountry.nombre;
    this.local_data.idgeografia = selectedCountry.idgeografia;
  }


  selectOptionCorporation(selectedCorporation: any) {
    if (selectedCorporation) {

      this.local_data.idcorporacion = selectedCorporation.idcorporacion;

      this.selectedCorporationName = selectedCorporation.nombrecorporacion;
      this.corporationControl.setValue(selectedCorporation.nombrecorporacion);
      this.corporationControl.updateValueAndValidity();
    }
  }

}
