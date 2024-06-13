import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MessagesPopups } from '@app/helpers/messagesPopups';
import { Observable, firstValueFrom, map, startWith } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { PrinciplesService } from '@app/services/principles.service';
import { PrincipleModel } from '@app/models/principle';

@Component({
  selector: 'app-edit-principle1',
  templateUrl: './edit-principle1.component.html',
  styleUrls: ['./edit-principle1.component.scss']
})
export class EditPrincipleComponent {
  loading: boolean = false;
  id: any;
  local_data: PrincipleModel = new PrincipleModel();
  principle_data: any ={};

  constructor(
    public datePipe: DatePipe,
    public principleService: PrinciplesService,
    public messagesPopups: MessagesPopups,
    public route:Router,
    activatedRouter: ActivatedRoute,


  ) {
    this.id = activatedRouter.snapshot.paramMap.get('id');
    
  }
  async ngOnInit(): Promise<void> {
    
    await this.getPrincipleData();

  }

  async getPrincipleData() {
    try {
      this.loading = true;
      
      this.principle_data = await firstValueFrom(this.principleService.getDataById(this.id));
      this.local_data = this.principle_data.data;
      this.loading = false;
    } catch (error) {
      console.error('Error al obtener datos del principio:', error);
      this.messagesPopups.popupMessage('Error al obtener datos del principio');

      this.loading = false;  
    }
  }
  


  formatDateData(timestamp: Date | null): string {
    if (timestamp === null) {
      return '';  
    }
    return format(new Date(timestamp), 'MM/dd/yyyy');
  }


  updateDetail() {
    this.loading=true;
    
    this.principleService.update(this.local_data).subscribe(
      data => {
        // if (data) {
        if (data.message == 'success') {
          this.messagesPopups.popupMessage(data.message);
          this.route.navigate(['/principles/principles-list']);
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

}
