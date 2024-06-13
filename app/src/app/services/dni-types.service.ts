import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '@app/models/response';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DniTypesService {

  constructor(
    private http: HttpClient

  ) { }
  getData() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/activeTypeId/`)
    .pipe(map(response => {
      return response;
    }));
  }
}
