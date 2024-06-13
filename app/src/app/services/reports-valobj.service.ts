import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '@app/models/response';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportsValobjService {

  constructor(
    private http: HttpClient
  ) { }
  create(bodyRequest: any) {
    return this.http.post<ResponseModel>(`${environment.apiUrl}/reports/api/ReportObjVals/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

}
