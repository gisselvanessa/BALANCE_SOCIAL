import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { format } from 'date-fns';
import { PersonService } from '@app/services/person.service';
import { MessagesPopups } from '@app/helpers/messagesPopups';


@Component({
  selector: 'app-view-person',
  templateUrl: './view-person.component.html',
  styleUrls: ['./view-person.component.scss']
})
export class ViewPersonComponent {
  loading: boolean = false;
  id: any;
  local_data: any ={}
  person_data: any ={};



  constructor(
    activatedRouter: ActivatedRoute, 
    private personService: PersonService,
    public messagesPopups: MessagesPopups
    ) {
    this.id = activatedRouter.snapshot.paramMap.get('id');
  }

  async ngOnInit(): Promise<void> {
    await this.getPersonData();
  }

  async getPersonData() {
    try {
      this.loading = true;
      
      this.person_data = await firstValueFrom(this.personService.getDataById(this.id));
  
       
      this.local_data = this.person_data.data;
  
      this.loading = false;
    } catch (error) {
      console.error('Error al obtener datos de la persona:', error);
      this.messagesPopups.popupMessage('Error al obtener datos de la persona');

       
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
